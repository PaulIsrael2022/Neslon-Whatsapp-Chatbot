const axios = require("axios");
const FormData = require("form-data");
const cron = require("node-cron");
const { User, Order, Pharmacy, TempOrder } = require("../config/db");
const moment = require("moment-timezone");

// Override moment to always return 10 AM
const fixedDate = moment()
  .tz("Africa/Johannesburg")
  .hour(8)
  .minute(0)
  .second(0);
moment.now = () => +fixedDate;

// To use the real time again, you can comment out the above line and uncomment this:
// moment.now = () => +new Date();

// Add this at the top of your main file
const ENABLE_PRESCRIPTION_IMAGE_LOGS = true;
const ENABLE_MESSAGE_FLOW_LOGS = true;
const ENABLE_ERROR_LOGS = true;

// Helper functions for controlled logging
function logPrescriptionImage(message) {
  if (ENABLE_PRESCRIPTION_IMAGE_LOGS) {
    console.log(`[PRESCRIPTION IMAGE] ${message}`);
  }
}

function logMessageFlow(message) {
  if (ENABLE_MESSAGE_FLOW_LOGS) {
    console.log(`[MESSAGE FLOW] ${message}`);
  }
}

function logError(message) {
  if (ENABLE_ERROR_LOGS) {
    console.error(`[ERROR] ${message}`);
  }
}

// WhatsApp Cloud API Configuration
const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";
const PHONE_NUMBER_ID = process.env.WHATSAPP_CLOUD_API_FROM_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN;

// Helper function to send WhatsApp messages
async function sendWhatsAppMessage(to, message, buttons = null) {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  let data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "text",
    text: { body: message },
  };

  if (buttons) {
    data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: message },
        action: {
          buttons: buttons.map((button, index) => ({
            type: "reply",
            reply: {
              id: `button_${index + 1}`,
              title: button,
            },
          })),
        },
      },
    };
  }

  try {
    await axios.post(url, data, { headers });
  } catch (error) {
    console.error(
      "Error sending WhatsApp message:",
      error.response?.data || error.message
    );
    // Send a generic error message to the user
    await sendWhatsAppMessage(
      to,
      "Sorry, we encountered an error. Please try again or contact support if the issue persists."
    );
  }
}

async function sendWhatsAppImage(to, imageData, caption) {
  const url = `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  try {
    let imageBuffer;
    if (Buffer.isBuffer(imageData)) {
      imageBuffer = imageData;
    } else if (imageData.buffer && Buffer.isBuffer(imageData.buffer)) {
      imageBuffer = imageData.buffer;
    } else if (typeof imageData === "object" && imageData.data) {
      // ADDED: Handle the new image structure
      imageBuffer = Buffer.from(imageData.data);
    } else {
      throw new Error("Invalid image data format");
    }

    // console.log("Image buffer length:", imageBuffer.length);

    // First, upload the image
    const formData = new FormData();
    formData.append("file", imageBuffer, {
      filename: "image.jpg",
      contentType: imageData.contentType || "image/jpeg",
    });
    formData.append("type", imageData.contentType || "image/jpeg");
    formData.append("messaging_product", "whatsapp");

    console.log("\n--- Uploading Image ---");
    const uploadResponse = await axios.post(
      `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/media`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    console.log("Upload response:", uploadResponse.data);
    const mediaId = uploadResponse.data.id;

    // Now send the image message
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "image",
      image: {
        id: mediaId,
        caption: caption,
      },
    };

    console.log("\n--- Sending Image Message ---");
    const response = await axios.post(url, data, { headers });
    console.log("WhatsApp image sent successfully:", response.data);
  } catch (error) {
    console.error("\n--- Error in sendWhatsAppImage ---");
    console.error("Error details:", error.response?.data || error.message);
    throw error;
  }

  console.log("\n--- End of sendWhatsAppImage ---");
}

// Function to retrieve media URL from media ID
async function getMediaUrl(mediaId) {
  const url = `${WHATSAPP_API_URL}/${mediaId}`;
  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  };

  try {
    console.log(`Requesting media URL for media ID: ${mediaId}`);
    const response = await axios.get(url, { headers });
    console.log(`Received media URL: ${response.data.url}`);
    return response.data.url;
  } catch (error) {
    console.error(
      `Error retrieving media URL for media ID ${mediaId}:`,
      error.response?.data || error.message
    );
    throw new Error(`Failed to retrieve media URL: ${error.message}`);
  }
}

// Function to download media from URL
async function downloadMedia(mediaUrl) {
  try {
    console.log(`Downloading media from URL: ${mediaUrl}`);
    const response = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      timeout: 30000, // 30 seconds timeout
    });
    console.log(`Downloaded media, size: ${response.data.length} bytes`);
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error(
      `Error downloading media from ${mediaUrl}:`,
      error.response?.data || error.message
    );
    throw new Error(`Failed to download media: ${error.message}`);
  }
}

// Registration steps
const registrationSteps = [
  { prompt: "Step 1: Please provide your first name.", field: "firstName" },
  {
    prompt: (firstName) =>
      `Step 2: Thank you, ${firstName}! Please provide your middle name. Type 'N/A' if you don't have one.`,
    field: "middleName",
  },
  {
    prompt: (firstName) =>
      `Step 3: Great, ${firstName}. Now, please provide your surname.`,
    field: "surname",
  },
  {
    prompt: (firstName) =>
      `Step 4: ${firstName}, please provide your date of birth in the format DD/MM/YYYY or DDMMYYYY.`,
    field: "dateOfBirth",
  },
  {
    prompt: (firstName) => `Step 5: ${firstName}, please select your gender:`,
    field: "gender",
    options: ["MALE", "FEMALE"],
    type: "button",
  },
  {
    prompt: (firstName) =>
      `Step 6: ${firstName}, are you the principal member or a dependent?`,
    field: "memberType",
    options: ["Principal Member", "Dependent"],
    type: "button",
  },
  {
    prompt: "Step 7: Please provide your dependent number.",
    field: "dependentNumber",
    conditionField: "memberType",
    conditionValue: "Dependent",
  },
  {
    prompt: (firstName) =>
      `Step 8: ${firstName}, please select your medical aid provider. Type a number:\n1. BOMAID\n2. PULA\n3. BPOMAS\n4. BOTSOGO\n5. Private Client`,
    field: "medicalAidProvider",
    options: ["BOMAID", "PULA", "BPOMAS", "BOTSOGO", "Private Client"],
    type: "number_select",
  },
  {
    prompt: "Step 9: Please provide your medical aid number.",
    field: "medicalAidNumber",
    conditionField: "medicalAidProvider",
    conditionValue: ["BOMAID", "PULA", "BPOMAS", "BOTSOGO"],
  },
  {
    prompt: "Step 10: Please specify your scheme (if applicable).",
    field: "scheme",
    conditionField: "medicalAidProvider",
    conditionValue: ["BOMAID", "PULA", "BPOMAS", "BOTSOGO"],
  },
  {
    prompt:
      "Step 11: Please upload a photo of the front of your Medical Aid Card.",
    field: "medicalAidCardFront",
    type: "image",
    conditionField: "medicalAidProvider",
    conditionValue: ["BOMAID", "PULA", "BPOMAS", "BOTSOGO"],
  },
  {
    prompt:
      "Step 12: Please upload a photo of the back of your Medical Aid Card.",
    field: "medicalAidCardBack",
    type: "image",
    conditionField: "medicalAidProvider",
    conditionValue: ["BOMAID", "PULA", "BPOMAS", "BOTSOGO"],
  },
  {
    prompt:
      "Final Step: Terms of Service: By using this chatbot, you give Telepharma the right to use and process your data to provide services. Do you accept these terms?",
    field: "termsAccepted",
    options: ["Yes", "No"],
    type: "button",
  },
];

async function sendRegistrationPrompt(user, preventSkip = false) {
  const step = registrationSteps[user.conversationState.currentStep];

  // UPDATED: Handle conditional steps, including step 7
  if (!preventSkip && step.conditionField && step.conditionValue) {
    const conditionFieldValue = user.conversationState.data.get(
      step.conditionField
    );
    if (!step.conditionValue.includes(conditionFieldValue)) {
      // ADDED: Special handling for step 7 (dependent number)
      if (step.field === "dependentNumber") {
        // If Principal Member, set dependentNumber to "00" and move to next step
        if (conditionFieldValue === "Principal Member") {
          user.conversationState.data.set("dependentNumber", "00");
          user.conversationState.currentStep++;
          await user.save();
          return sendRegistrationPrompt(user);
        }
        // If Dependent, don't skip this step
      } else {
        // For other conditional steps, skip as before
        user.conversationState.currentStep++;
        await user.save();
        return sendRegistrationPrompt(user);
      }
    }
  }

  let message =
    typeof step.prompt === "function"
      ? step.prompt(user.conversationState.data.get("firstName"))
      : step.prompt;

  if (user.conversationState.currentStep > 0) {
    message += '\n\nEnter "b" or "B" to go back to the previous step.';
  }

  if (step.type === "button" && step.options) {
    await sendWhatsAppMessage(user.phoneNumber, message, step.options);
  } else if (step.type === "number_select") {
    await sendWhatsAppMessage(user.phoneNumber, message);
  } else {
    await sendWhatsAppMessage(user.phoneNumber, message);
  }
}

async function handleRegistration(user, message) {
  let messageContent = "";
  let messageType = message.type;

  if (messageType === "text") {
    messageContent = message.text.body;
  } else if (
    messageType === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else if (messageType === "image") {
    messageContent = "IMAGE";
  } else {
    messageContent = "UNKNOWN";
  }

  try {
    const step = registrationSteps[user.conversationState.currentStep];

    if (
      messageType === "text" &&
      messageContent.toLowerCase() === "b" &&
      user.conversationState.currentStep > 0
    ) {
      let previousStep = user.conversationState.currentStep - 1;

      while (previousStep >= 0) {
        const prevStep = registrationSteps[previousStep];
        if (prevStep.conditionField && prevStep.conditionValue) {
          const conditionFieldValue = user.conversationState.data.get(
            prevStep.conditionField
          );
          if (!prevStep.conditionValue.includes(conditionFieldValue)) {
            if (
              prevStep.field === "dependentNumber" &&
              conditionFieldValue === "Principal Member"
            ) {
              previousStep = 5;
              break;
            }
            previousStep--;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      if (previousStep >= 0) {
        user.conversationState.currentStep = previousStep;
        user.conversationState.data.delete(
          registrationSteps[user.conversationState.currentStep].field
        );
        await user.save();

        await sendRegistrationPrompt(user, true);
        return;
      }
    }
    let isValid = true;
    let parsedValue = messageContent;

    // Input validation
    console.log("Validating input for field:", step.field);
    switch (step.field) {
      case "dateOfBirth":
        const dateRegex = /^(\d{2}\/\d{2}\/\d{4}|\d{8})$/;
        if (!dateRegex.test(messageContent)) {
          isValid = false;
        } else {
          let day, month, year;
          if (messageContent.includes("/")) {
            [day, month, year] = messageContent.split("/");
          } else {
            day = messageContent.substring(0, 2);
            month = messageContent.substring(2, 4);
            year = messageContent.substring(4);
          }
          parsedValue = new Date(year, month - 1, day);
          if (isNaN(parsedValue.getTime()) || parsedValue > new Date()) {
            isValid = false;
          }
        }
        break;
      case "gender":
      case "memberType":
        if (!step.options.includes(messageContent)) {
          isValid = false;
        } else {
          if (step.field === "memberType") {
            user.memberType = parsedValue;
          } else if (step.field === "gender") {
            user.gender = parsedValue;
          }
        }
        break;
      case "termsAccepted":
        if (messageContent === "Yes") {
          parsedValue = true;
        } else if (messageContent === "No") {
          parsedValue = false;
          await sendWhatsAppMessage(
            user.phoneNumber,
            "You need to accept the terms of service to use our service. Your registration has been canceled."
          );
          user.conversationState = {
            currentFlow: "REGISTRATION",
            currentStep: 0,
            data: new Map(),
            lastUpdated: new Date(),
          };
          await user.save();
          return;
        } else {
          isValid = false;
        }
        break;
      case "medicalAidProvider":
        if (step.type === "number_select") {
          const providerIndex = parseInt(messageContent) - 1;
          if (providerIndex >= 0 && providerIndex < step.options.length) {
            parsedValue = step.options[providerIndex];
          } else {
            isValid = false;
          }
        } else {
          if (!step.options.includes(messageContent)) {
            isValid = false;
          }
        }
        break;
      case "dependentNumber":
        if (user.memberType === "Principal Member") {
          parsedValue = "00";
          user.dependentNumber = parsedValue;
          user.conversationState.data.set("dependentNumber", parsedValue);
          user.conversationState.currentStep++;
          await user.save();
          await sendRegistrationPrompt(user);
          return;
        }
        break;
      case "medicalAidCardFront":
      case "medicalAidCardBack":
        console.log("Processing medical aid card image");
        if (messageType !== "image") {
          console.log("Invalid input: Not an image");
          isValid = false;
        } else {
          try {
            const mediaId = message.image.id;
            console.log("Media ID:", mediaId);
            const mediaUrl = await getMediaUrl(mediaId);
            console.log("Media URL:", mediaUrl);
            const imageBuffer = await downloadMedia(mediaUrl);
            console.log("Image downloaded, buffer length:", imageBuffer.length);

            if (imageBuffer.length === 0) {
              throw new Error("Downloaded image is empty");
            }

            const mimeType = message.image.mime_type;
            const validImageTypes = [
              "image/jpeg",
              "image/png",
              "image/jpg",
              "image/gif",
            ];

            if (validImageTypes.includes(mimeType)) {
              parsedValue = {
                data: imageBuffer,
                contentType: mimeType,
              };
              console.log("Image processed successfully. Type:", mimeType);
              isValid = true;
            } else {
              console.log("Invalid image type:", mimeType);
              isValid = false;
            }
          } catch (error) {
            console.error("Error processing Medical Aid Card image:", error);
            isValid = false;
          }
        }
        break;
    }

    console.log("Input validation result:", isValid ? "Valid" : "Invalid");

    if (!isValid) {
      console.log("Sending invalid input message");
      let errorMessage = "Invalid input. Please try again.";
      if (
        step.field === "medicalAidCardFront" ||
        step.field === "medicalAidCardBack"
      ) {
        errorMessage = "Please upload a valid image file (JPEG, PNG, or GIF).";
      }
      await sendWhatsAppMessage(user.phoneNumber, errorMessage);
      await sendRegistrationPrompt(user);
      return;
    }

    console.log("Updating conversation state with new value");
    user.conversationState.data.set(step.field, parsedValue);

    if (user.conversationState.currentStep < registrationSteps.length - 1) {
      console.log("Moving to next step");
      user.conversationState.currentStep++;

      if (step.field === "memberType") {
        if (parsedValue === "Principal Member") {
          user.conversationState.data.set("dependentNumber", "00");
        }
      } else if (
        step.field === "medicalAidProvider" &&
        parsedValue === "Private Client"
      ) {
        while (
          user.conversationState.currentStep < registrationSteps.length - 1 &&
          registrationSteps[user.conversationState.currentStep]
            .conditionField === "medicalAidProvider" &&
          !registrationSteps[
            user.conversationState.currentStep
          ].conditionValue.includes("Private Client")
        ) {
          user.conversationState.currentStep++;
        }
      }

      await user.save();
      await sendRegistrationPrompt(user);
    } else {
      for (const [field, value] of user.conversationState.data) {
        user[field] = value;
      }
      user.isRegistrationComplete = user.termsAccepted;
      user.conversationState = {
        currentFlow: "MAIN_MENU",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendCompletionMessage(user);
    }
  } catch (error) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We encountered an error processing your registration. Please try again or contact support."
    );
  }
}

async function clearTempOrder(userId) {
  try {
    await TempOrder.deleteOne({ user: userId });
    console.log(`Temporary order cleared for user ${userId}`);
  } catch (error) {
    console.error(`Error clearing temporary order for user ${userId}:`, error);
  }
}

async function sendRegistrationPrompt(user) {
  const step = registrationSteps[user.conversationState.currentStep];

  if (step.conditionField && step.conditionValue) {
    const conditionFieldValue = user.conversationState.data.get(
      step.conditionField
    );
    if (!step.conditionValue.includes(conditionFieldValue)) {
      user.conversationState.currentStep++;
      await user.save();
      return sendRegistrationPrompt(user);
    }
  }

  let message = step.prompt;

  if (user.conversationState.currentStep > 0) {
    message += '\n\nEnter "b" or "B" to go back to the previous step.';
  }

  if (step.type === "button" && step.options) {
    await sendWhatsAppMessage(user.phoneNumber, message, step.options);
  } else if (step.type === "number_select") {
    await sendWhatsAppMessage(user.phoneNumber, message);
  } else {
    await sendWhatsAppMessage(user.phoneNumber, message);
  }
}

async function sendCompletionMessage(user) {
  const message = `Thank you for registering, ${user.firstName}! Your registration is now complete. You can now use our WhatsApp medication delivery service.`;
  await sendWhatsAppMessage(user.phoneNumber, message);
  await sendMainMenu(user);
}

async function sendWelcomeMessage(user) {
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Welcome to Telepharma Botswana! To start using our WhatsApp medication delivery service, you need to complete a quick registration process. This will help us serve you better. Let's begin!"
  );
  await sendRegistrationPrompt(user);
}

async function sendMainMenu(user) {
  const message = "Main Menu:";
  const buttons = ["Place an Order", "View Order Status", "More"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
}

// Update sendMoreOptions function
async function sendMoreOptions(user) {
  const message = "More Options:";
  const buttons = ["Med Consultation", "General Enquiry", "Edit Profile"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter b to go back to the Main Menu."
  );
}

// New function to handle profile editing
async function handleProfileEdit(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log("Unhandled message type in handleProfileEdit:", message.type);
    messageContent = "UNKNOWN";
  }

  console.log("Processed message content:", messageContent);

  if (messageContent === "b" || messageContent === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  if (!user.conversationState.currentStep) {
    const editOptions = `
What would you like to edit?
1. First Name
2. Middle Name
3. Last Name
4. Date of Birth
5. Gender
6. Medical Aid Provider
7. Medical Aid Number
8. Scheme
9. Dependent Number
10. Medical Aid Card Front Image
11. Medical Aid Card Back Image
12. View Profile
13. Manage Dependents
14. Back to Main Menu

Enter the number of the item you want to edit or view.`;
    await sendWhatsAppMessage(user.phoneNumber, editOptions);
    user.conversationState.currentStep = "SELECT_EDIT_OPTION";
    await user.save();
    return;
  }

  if (user.conversationState.currentStep === "SELECT_EDIT_OPTION") {
    const option = parseInt(messageContent);
    switch (option) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        await handleEditField(user, option);
        break;
      case 12:
        await viewProfile(user);
        break;
      case 13:
        await manageDependents(user);
        break;
      case 14:
        await sendMainMenu(user);
        break;
      default:
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        user.conversationState.currentStep = null;
        await handleProfileEdit(user, "");
    }
  } else if (user.conversationState.currentStep === "EDIT_FIELD") {
    await handleFieldInput(user, messageContent);
  } else if (user.conversationState.currentStep === "MANAGE_DEPENDENTS") {
    await handleDependentManagement(user, messageContent);
  }
}

async function handleEditField(user, option) {
  const fieldMap = {
    1: "firstName",
    2: "middleName",
    3: "lastName",
    4: "dateOfBirth",
    5: "gender",
    6: "medicalAidProvider",
    7: "medicalAidNumber",
    8: "scheme",
    9: "dependentNumber",
    10: "medicalAidCardFront",
    11: "medicalAidCardBack",
  };

  const field = fieldMap[option];
  user.conversationState.currentStep = "EDIT_FIELD";
  user.conversationState.data.set("editingField", field);
  await user.save();

  let prompt;
  switch (field) {
    case "gender":
      prompt = "Please select your gender:\n1. MALE\n2. FEMALE";
      break;
    case "medicalAidProvider":
      prompt =
        "Please select your medical aid provider:\n1. BOMAID\n2. PULA\n3. BPOMAS\n4. BOTSOGO";
      break;
    case "dateOfBirth":
      prompt = "Please enter your date of birth in the format DD/MM/YYYY.";
      break;
    case "medicalAidCardFront":
    case "medicalAidCardBack":
      prompt = `Please upload a new photo of the ${
        field === "medicalAidCardFront" ? "front" : "back"
      } of your Medical Aid Card.`;
      break;
    default:
      prompt = `Please enter your new ${field
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()}:`;
  }

  await sendWhatsAppMessage(user.phoneNumber, prompt);
}

async function handleFieldInput(user, input) {
  const field = user.conversationState.data.get("editingField");
  let value = input;

  // Validate and process the input
  switch (field) {
    case "dateOfBirth":
      const dateRegex = /^(\d{2}\/\d{2}\/\d{4}|\d{8})$/;
      if (!dateRegex.test(value)) {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid date format. Please use DD/MM/YYYY."
        );
        return;
      }
      let day, month, year;
      if (value.includes("/")) {
        [day, month, year] = value.split("/");
      } else {
        day = value.substring(0, 2);
        month = value.substring(2, 4);
        year = value.substring(4);
      }
      value = new Date(year, month - 1, day);
      break;
    case "gender":
      const genderOptions = ["MALE", "FEMALE"];
      const genderIndex = parseInt(value) - 1;
      if (genderIndex < 0 || genderIndex >= genderOptions.length) {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid gender option. Please enter 1 for MALE or 2 for FEMALE."
        );
        return;
      }
      value = genderOptions[genderIndex];
      break;
    case "medicalAidProvider":
      const providerOptions = ["BOMAID", "PULA", "BPOMAS", "BOTSOGO"];
      const providerIndex = parseInt(value) - 1;
      if (providerIndex < 0 || providerIndex >= providerOptions.length) {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid provider option. Please enter a number between 1 and 4."
        );
        return;
      }
      value = providerOptions[providerIndex];
      break;
    case "medicalAidCardFront":
    case "medicalAidCardBack":
      if (input.type !== "image") {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Please upload an image of your Medical Aid Card."
        );
        return;
      }
      try {
        const mediaId = input.image.id;
        const mediaUrl = await getMediaUrl(mediaId);
        const imageBuffer = await downloadMedia(mediaUrl);
        value = {
          data: imageBuffer,
          contentType: "image/jpeg", // Assuming JPEG, adjust if needed
        };
      } catch (error) {
        console.error("Error processing Medical Aid Card image:", error);
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Error processing the image. Please try uploading again."
        );
        return;
      }
      break;
  }

  // Update the user's data
  user[field] = value;
  await user.save();

  await sendWhatsAppMessage(
    user.phoneNumber,
    `Your ${field
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()} has been updated successfully.`
  );

  // Reset the conversation state and show edit options again
  user.conversationState.currentStep = null;
  await user.save();
  await handleProfileEdit(user, "");
}

async function viewProfile(user) {
  const profile = `
Your Profile:
First Name: ${user.firstName || "Not set"}
Middle Name: ${user.middleName || "Not set"}
Last Name: ${user.lastName || "Not set"}
Date of Birth: ${user.dateOfBirth ? user.dateOfBirth.toDateString() : "Not set"}
Gender: ${user.gender || "Not set"}
Medical Aid Provider: ${user.medicalAidProvider || "Not set"}
Medical Aid Number: ${user.medicalAidNumber || "Not set"}
Scheme: ${user.scheme || "Not set"}
Dependent Number: ${user.dependentNumber || "Not set"}
Medical Aid Card Images: ${
    user.medicalAidCardFront && user.medicalAidCardBack
      ? "Uploaded"
      : "Not uploaded"
  }
`;
  await sendWhatsAppMessage(user.phoneNumber, profile);

  // Show dependents if any
  if (user.dependents && user.dependents.length > 0) {
    let dependentsList = "\nYour Dependents:\n";
    user.dependents.forEach((dep, index) => {
      dependentsList += `${index + 1}. ${dep.firstName} ${
        dep.middleName || ""
      } ${dep.lastName} (${dep.dependentNumber})\n`;
    });
    await sendWhatsAppMessage(user.phoneNumber, dependentsList);
  }

  // Reset conversation state to show edit options again
  user.conversationState.currentStep = null;
  await user.save();
  await handleProfileEdit(user, "");
}

async function manageDependents(user) {
  const dependentOptions = `
Manage Dependents:
1. View Dependents
2. Add Dependent
3. Remove Dependent
4. Back to Edit Profile

Enter the number of the action you want to perform.`;
  await sendWhatsAppMessage(user.phoneNumber, dependentOptions);
  user.conversationState.currentStep = "MANAGE_DEPENDENTS";
  user.conversationState.data.set("dependentAction", null);
  await user.save();
}

async function handleDependentManagement(user, input) {
  const action = user.conversationState.data.get("dependentAction");

  if (!action) {
    switch (input) {
      case "1":
        await viewDependents(user);
        break;
      case "2":
        await startAddDependent(user);
        break;
      case "3":
        await startRemoveDependent(user);
        break;
      case "4":
        user.conversationState.currentStep = null;
        await user.save();
        await handleProfileEdit(user, "");
        break;
      default:
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        await manageDependents(user);
    }
  } else if (action === "ADD_DEPENDENT") {
    await continueAddDependent(user, input);
  } else if (action === "REMOVE_DEPENDENT") {
    await finishRemoveDependent(user, input);
  }
}

async function viewDependents(user) {
  if (user.dependents && user.dependents.length > 0) {
    let dependentsList = "Your Dependents:\n";
    user.dependents.forEach((dep, index) => {
      dependentsList += `${index + 1}. ${dep.firstName} ${
        dep.middleName || ""
      } ${dep.lastName} (${dep.dependentNumber})\n`;
    });
    await sendWhatsAppMessage(user.phoneNumber, dependentsList);
  } else {
    await sendWhatsAppMessage(user.phoneNumber, "You have no dependents.");
  }
  await manageDependents(user);
}

async function startAddDependent(user) {
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Please enter the following details for the new dependent:\nFirst Name, Middle Name (optional), Last Name, Date of Birth (DD/MM/YYYY), Dependent Number\n\nSeparate each field with a comma. For example:\nJohn, Michael, Doe, 15/05/2000, 01"
  );
  user.conversationState.data.set("dependentAction", "ADD_DEPENDENT");
  await user.save();
}

async function continueAddDependent(user, input) {
  const fields = input.split(",").map((field) => field.trim());
  if (fields.length < 4 || fields.length > 5) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid input. Please provide all required fields."
    );
    await startAddDependent(user);
    return;
  }

  const [firstName, middleName, lastName, dateOfBirth, dependentNumber] =
    fields;
  const dateRegex = /^(\d{2}\/\d{2}\/\d{4})$/;
  if (!dateRegex.test(dateOfBirth)) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid date format. Please use DD/MM/YYYY."
    );
    await startAddDependent(user);
    return;
  }

  const newDependent = {
    firstName,
    middleName: middleName || "",
    lastName,
    dateOfBirth: new Date(dateOfBirth.split("/").reverse().join("-")),
    dependentNumber:
      dependentNumber || String(user.dependents.length + 1).padStart(2, "0"),
    id: `DEP${String(user.dependents.length + 1).padStart(3, "0")}`,
  };

  user.dependents.push(newDependent);
  await user.save();

  await sendWhatsAppMessage(
    user.phoneNumber,
    `Dependent added successfully:\n${newDependent.firstName} ${newDependent.middleName} ${newDependent.lastName} (${newDependent.dependentNumber})`
  );

  user.conversationState.data.set("dependentAction", null);
  await user.save();
  await manageDependents(user);
}

async function startRemoveDependent(user) {
  if (user.dependents && user.dependents.length > 0) {
    let dependentsList = "Select the dependent to remove:\n";
    user.dependents.forEach((dep, index) => {
      dependentsList += `${index + 1}. ${dep.firstName} ${
        dep.middleName || ""
      } ${dep.lastName} (${dep.dependentNumber})\n`;
    });
    await sendWhatsAppMessage(user.phoneNumber, dependentsList);
    user.conversationState.data.set("dependentAction", "REMOVE_DEPENDENT");
    await user.save();
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "You have no dependents to remove."
    );
    await manageDependents(user);
  }
}

async function finishRemoveDependent(user, input) {
  const index = parseInt(input) - 1;
  if (isNaN(index) || index < 0 || index >= user.dependents.length) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid selection. Please try again."
    );
    await startRemoveDependent(user);
    return;
  }

  const removedDependent = user.dependents.splice(index, 1)[0];
  await user.save();

  await sendWhatsAppMessage(
    user.phoneNumber,
    `Dependent removed successfully:\n${removedDependent.firstName} ${
      removedDependent.middleName || ""
    } ${removedDependent.lastName} (${removedDependent.dependentNumber})`
  );

  user.conversationState.data.set("dependentAction", null);
  await user.save();
  await manageDependents(user);
}

// Main handleProfileEdit function (updated to include new options)
async function handleProfileEdit(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log("Unhandled message type in handleProfileEdit:", message.type);
    messageContent = "UNKNOWN";
  }

  console.log("Processed message content:", messageContent);

  if (messageContent === "b" || messageContent === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  if (!user.conversationState.currentStep) {
    const editOptions = `
What would you like to edit?
1. First Name
2. Middle Name
3. Last Name
4. Date of Birth
5. Gender
6. Medical Aid Provider
7. Medical Aid Number
8. Scheme
9. Dependent Number
10. Medical Aid Card Front Image
11. Medical Aid Card Back Image
12. View Profile
13. Manage Dependents
14. Back to Main Menu

Enter the number of the item you want to edit or view.`;
    await sendWhatsAppMessage(user.phoneNumber, editOptions);
    user.conversationState.currentStep = "SELECT_EDIT_OPTION";
    await user.save();
    return;
  }

  if (user.conversationState.currentStep === "SELECT_EDIT_OPTION") {
    const option = parseInt(messageContent);
    switch (option) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        await handleEditField(user, option);
        break;
      case 12:
        await viewProfile(user);
        break;
      case 13:
        await manageDependents(user);
        break;
      case 14:
        await sendMainMenu(user);
        break;
      default:
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        user.conversationState.currentStep = null;
        await handleProfileEdit(user, "");
    }
  } else if (user.conversationState.currentStep === "EDIT_FIELD") {
    await handleFieldInput(user, messageContent);
  } else if (user.conversationState.currentStep === "MANAGE_DEPENDENTS") {
    await handleDependentManagement(user, messageContent);
  }
}
// -----------------------------------------------------------------------------------------------------------------------
async function handleMainMenu(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log("Unhandled message type in handleMainMenu:", message.type);
    messageContent = "UNKNOWN";
  }

  // Check for general greetings
  const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
  ];
  if (greetings.includes(messageContent.toLowerCase())) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      `Hello ${user.firstName}! How can I assist you today?`
    );
    await sendMainMenu(user);
    return;
  }

  switch (messageContent) {
    case "Place an Order":
      user.conversationState = {
        currentFlow: "PLACE_ORDER",
        currentStep: "MEDICATION_TYPE",
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendMedicationTypeOptions(user);
      break;
    case "View Order Status":
      user.conversationState = {
        currentFlow: "VIEW_ORDER_STATUS",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await handleViewOrderStatus(user, messageContent);
      break;
    case "More":
      await sendMoreOptions(user);
      break;
    case "Med Consultation":
      user.conversationState = {
        currentFlow: "PHARMACY_CONSULTATION",
        currentStep: "ENTER_ISSUE",
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Please describe your issue or question for the pharmacy.\n\nEnter b to go back to the main menu."
      );
      break;
    case "General Enquiry":
      user.conversationState = {
        currentFlow: "GENERAL_ENQUIRY",
        currentStep: "ENTER_ENQUIRY",
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Please enter your general enquiry.\n\nEnter b to go back to the main menu."
      );
      break;
    case "Edit Profile":
      user.conversationState = {
        currentFlow: "EDIT_PROFILE",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await handleProfileEdit(user, "");
      break;
    default:
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid option. Please try again."
      );
      await sendMainMenu(user);
  }
}

async function sendMedicationTypeOptions(user) {
  const message = "Medication Details:";
  //   const buttons = ["Prescription Medicine", "Over-the-Counter"];
  const buttons = ["Prescription", "OTC"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Prescription: For prescribed medications\nOTC: For over-the-counter medications\n\nEnter b to go back to the main menu."
  );
}

// New helper function to fetch and format dependents
async function fetchAndFormatDependents(userId) {
  const user = await User.findById(userId);
  if (!user || !user.dependents || user.dependents.length === 0) {
    return null;
  }

  return user.dependents.map((dependent, index) => ({
    index: index + 1,
    id: dependent.id,
    name: `${dependent.firstName} ${
      dependent.middleName ? dependent.middleName + " " : ""
    }${dependent.lastName}`,
    dependentNumber: dependent.dependentNumber,
    dateOfBirth: dependent.dateOfBirth,
  }));
}

// New helper function to send dependent options to user
async function sendDependentOptions(user, dependents) {
  let message = "Please select a dependent:\n\n";
  dependents.forEach((dep) => {
    message += `${dep.index}. ${dep.name} (Dependent Number: ${dep.dependentNumber})\n`;
  });
  message += "\nEnter the number of the dependent or 'b' to go back.";
  await sendWhatsAppMessage(user.phoneNumber, message);
}

async function sendDeliveryScheduleOptions(user) {
  const schedules = [
    "09:30 AM - 11:00 AM",
    "11:00 AM - 12:30 PM",
    "01:30 PM - 03:00 PM",
    "03:00 PM - 04:30 PM",
    "04:30 PM - 06:00 PM",
  ];

  const currentTime = moment().tz("Africa/Johannesburg");
  let message = `Current time: ${currentTime.format(
    "YYYY-MM-DD HH:mm:ss"
  )}\n\n`;
  message += "Please select a delivery schedule:\n\n";
  let activeOptions = [];
  let allPassed = true;

  schedules.forEach((schedule, index) => {
    const [startTime, endTime] = schedule
      .split(" - ")
      .map((t) => moment(t, "hh:mm A"));
    const isActive = currentTime.isBefore(endTime.subtract(20, "minutes"));

    if (isActive) {
      activeOptions.push(index + 1);
      message += `${index + 1}. ${schedule}\n`;
      allPassed = false;
    } else {
      message += `${schedule} -- Inactive\n`;
    }
  });

  if (allPassed) {
    message +=
      "\nAll delivery schedules for today have passed. Your order will be delivered tomorrow between 09:30 AM - 11:00 AM.\n";
    user.conversationState.data.set("deliverySchedule", "09:30 AM - 11:00 AM");
    user.conversationState.data.set(
      "deliveryDate",
      currentTime.add(1, "day").format("YYYY-MM-DD")
    );
    await sendWhatsAppMessage(user.phoneNumber, message, [
      "Continue",
      "Cancel Order",
    ]);
  } else {
    message += "\nPlease enter the number of your preferred delivery schedule.";
    await sendWhatsAppMessage(user.phoneNumber, message);
  }

  return { activeOptions, allPassed };
}

async function handlePlaceOrder(user, message) {
  logMessageFlow("Entered handlePlaceOrder function");

  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else if (message.type === "image") {
    messageContent = "IMAGE";
  } else {
    logMessageFlow(
      `Unhandled message type in handlePlaceOrder: ${message.type}`
    );
    messageContent = "UNKNOWN";
  }

  logMessageFlow(`Processed message content: ${messageContent}`);

  if (messageContent === "b" || messageContent === "B") {
    logMessageFlow("User pressed 'B' to go back");
    const currentStep = user.conversationState.currentStep;
    logMessageFlow(`Current step: ${currentStep}`);

    // HIGHLIGHT: Updated steps array to include all steps in the order process
    const steps = [
      "MEDICATION_TYPE",
      "PRESCRIPTION_OPTIONS",
      "NEW_PRESCRIPTION_FOR",
      "SELECT_DEPENDENT",
      "UPLOAD_PRESCRIPTION",
      "OTC_MEDICATION_LIST",
      "DELIVERY_METHOD",
      "SELECT_PHARMACY",
      "DELIVERY_ADDRESS_TYPE",
      "SELECT_WORK_ADDRESS",
      "SELECT_HOME_ADDRESS",
      "ENTER_WORK_ADDRESS",
      "ENTER_HOME_ADDRESS",
      "CONFIRM_SAVE_ADDRESS",
      "ENTER_EXTRA_NOTES",
      "SELECT_DELIVERY_SCHEDULE",
      "CONFIRM_ORDER",
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      let previousStep = steps[currentIndex - 1];
      switch (currentStep) {
        case "NEW_PRESCRIPTION_FOR":
          previousStep = "PRESCRIPTION_OPTIONS";
          break;
        case "SELECT_DEPENDENT":
          previousStep = "NEW_PRESCRIPTION_FOR";
          break;
        case "UPLOAD_PRESCRIPTION":
          previousStep =
            user.conversationState.data.get("prescriptionFor") ===
            "Dependent Member"
              ? "SELECT_DEPENDENT"
              : "NEW_PRESCRIPTION_FOR";
          break;
        case "OTC_MEDICATION_LIST":
          previousStep = "MEDICATION_TYPE";
          break;
        case "DELIVERY_METHOD":
          const orderType = user.conversationState.data.get("orderType");
          if (orderType === "OVER_THE_COUNTER") {
            previousStep = "OTC_MEDICATION_LIST";
          } else if (orderType === "NEW_PRESCRIPTION") {
            previousStep = "UPLOAD_PRESCRIPTION";
          } else if (orderType === "PRESCRIPTION_REFILL") {
            previousStep = "SELECT_REFILL";
          }
          break;
        case "SELECT_PHARMACY":
        case "DELIVERY_ADDRESS_TYPE":
          previousStep = "DELIVERY_METHOD";
          break;
        case "SELECT_WORK_ADDRESS":
        case "SELECT_HOME_ADDRESS":
        case "ENTER_WORK_ADDRESS":
        case "ENTER_HOME_ADDRESS":
          previousStep = "DELIVERY_ADDRESS_TYPE";
          break;
        case "CONFIRM_SAVE_ADDRESS":
          previousStep = user.conversationState.data.get("workAddress")
            ? "ENTER_WORK_ADDRESS"
            : "ENTER_HOME_ADDRESS";
          break;
        case "ENTER_EXTRA_NOTES":
          previousStep =
            user.conversationState.data.get("deliveryMethod") === "Delivery"
              ? user.conversationState.data.get("workAddress")
                ? "SELECT_WORK_ADDRESS"
                : "SELECT_HOME_ADDRESS"
              : "SELECT_PHARMACY";
          break;
        case "SELECT_DELIVERY_SCHEDULE":
          previousStep = "ENTER_EXTRA_NOTES";
          break;
      }

      user.conversationState.currentStep = previousStep;
      await user.save();

      // HIGHLIGHT: Updated switch case to handle all steps
      switch (previousStep) {
        case "MEDICATION_TYPE":
          await sendMedicationTypeOptions(user);
          break;
        case "PRESCRIPTION_OPTIONS":
          await sendPrescriptionOptions(user);
          break;
        case "NEW_PRESCRIPTION_FOR":
          await sendNewPrescriptionOptions(user);
          break;
        case "SELECT_DEPENDENT":
          const dependents = await fetchAndFormatDependents(user._id);
          await sendDependentOptions(user, dependents);
          break;
        case "UPLOAD_PRESCRIPTION":
          await sendWhatsAppMessage(
            user.phoneNumber,
            "Please upload a clear photo of your prescription or type 'done' if you've finished uploading. Make sure to double-check the image for clarity before submitting.\n\nEnter 'b' to go back to the previous step."
          );
          break;
        case "OTC_MEDICATION_LIST":
          await sendWhatsAppMessage(
            user.phoneNumber,
            "Please enter a list of medications you would like to order.\n\nEnter b to go back to the previous step."
          );
          break;
        case "DELIVERY_METHOD":
          await sendDeliveryOptions(user);
          break;
        case "SELECT_PHARMACY":
          await sendPharmacyOptions(user);
          break;
        case "DELIVERY_ADDRESS_TYPE":
          await sendDeliveryAddressOptions(user);
          break;
        case "SELECT_WORK_ADDRESS":
        case "SELECT_HOME_ADDRESS":
          const addressType =
            previousStep === "SELECT_WORK_ADDRESS" ? "work" : "home";
          await sendSavedAddresses(user, addressType);
          break;
        case "ENTER_WORK_ADDRESS":
        case "ENTER_HOME_ADDRESS":
          const addrType =
            previousStep === "ENTER_WORK_ADDRESS" ? "work" : "home";
          await sendWhatsAppMessage(
            user.phoneNumber,
            `Please enter your ${addrType} address.\n\nEnter b to go back to the previous step.`
          );
          break;
        case "ENTER_EXTRA_NOTES":
          await sendExtraNotesPrompt(user);
          break;
        case "SELECT_REFILL":
          await sendRefillOptions(user);
          break;
        default:
          await handlePlaceOrder(user, { type: "text", text: { body: "" } });
      }
      logMessageFlow("--- Exiting handlePlaceOrder (after going back) ---");
      return;
    } else if (currentIndex === 0) {
      // If we're at the first step (MEDICATION_TYPE), go back to the main menu
      user.conversationState = {
        currentFlow: "MAIN_MENU",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendMainMenu(user);
      logMessageFlow(
        "--- Exiting handlePlaceOrder (returned to main menu) ---"
      );
      return;
    }
  } else if (messageContent === "0") {
    await clearTempOrder(user._id);
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    logMessageFlow("--- Exiting handlePlaceOrder (returned to main menu) ---");
    return;
  }

  // HIGHLIGHT: Updated switch case to handle all steps
  switch (user.conversationState.currentStep) {
    case "MEDICATION_TYPE":
      logMessageFlow("Handling MEDICATION_TYPE step");
      if (messageContent === "Prescription") {
        user.conversationState.currentStep = "PRESCRIPTION_OPTIONS";
        await user.save();
        await sendPrescriptionOptions(user);
      } else if (messageContent === "OTC") {
        user.conversationState.data.set("orderType", "OVER_THE_COUNTER");
        user.conversationState.currentStep = "OTC_MEDICATION_LIST";
        await user.save();
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Please enter a list of medications you would like to order.\n\nEnter b to go back to the previous step."
        );
      } else {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        await sendMedicationTypeOptions(user);
      }
      break;
    case "PRESCRIPTION_OPTIONS":
      logMessageFlow("Handling PRESCRIPTION_OPTIONS step");
      if (messageContent === "Prescription Refill") {
        user.conversationState.currentStep = "SELECT_REFILL";
        user.conversationState.data.set("orderType", "PRESCRIPTION_REFILL");
        await user.save();
        await sendRefillOptions(user);
      } else if (messageContent === "New Prescription") {
        user.conversationState.currentStep = "NEW_PRESCRIPTION_FOR";
        user.conversationState.data.set("orderType", "NEW_PRESCRIPTION");
        await user.save();
        await sendNewPrescriptionOptions(user);
      } else {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        await sendPrescriptionOptions(user);
      }
      break;
    case "NEW_PRESCRIPTION_FOR":
      logMessageFlow("Handling NEW_PRESCRIPTION_FOR step");
      if (
        messageContent === "Main Member" ||
        messageContent === "Dependent Member" ||
        messageContent === "Main & Dependent"
      ) {
        user.conversationState.data.set("prescriptionFor", messageContent);

        if (
          messageContent === "Dependent Member" ||
          messageContent === "Main & Dependent"
        ) {
          const dependents = await fetchAndFormatDependents(user._id);
          if (dependents) {
            user.conversationState.data.set("dependents", dependents);
            user.conversationState.currentStep = "SELECT_DEPENDENT";
            await user.save();
            await sendDependentOptions(user, dependents);
          } else {
            // No dependents found, move to prescription upload
            user.conversationState.currentStep = "UPLOAD_PRESCRIPTION";
            await user.save();
            await sendWhatsAppMessage(
              user.phoneNumber,
              "No dependents found. Proceeding to prescription upload.\n\nPlease upload a clear photo of your prescription or type 'done' if you've finished uploading. Make sure to double-check the image for clarity before submitting.\n\nEnter 'b' to go back to the previous step."
            );
          }
        } else {
          // Main Member, proceed to prescription upload
          user.conversationState.currentStep = "UPLOAD_PRESCRIPTION";
          await user.save();
          await sendWhatsAppMessage(
            user.phoneNumber,
            "Please upload a clear photo of your prescription or type 'done' if you've finished uploading. Make sure to double-check the image for clarity before submitting.\n\nEnter 'b' to go back to the previous step."
          );
        }
      } else {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid option. Please try again."
        );
        await sendNewPrescriptionOptions(user);
      }
      break;
    case "SELECT_DEPENDENT":
      logMessageFlow("Handling SELECT_DEPENDENT step");
      const dependents = user.conversationState.data.get("dependents");
      console.log(
        "Dependents from conversation state:",
        JSON.stringify(dependents)
      );
      const selectedIndex = parseInt(messageContent) - 1;
      console.log("Selected index:", selectedIndex);

      if (
        isNaN(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= dependents.length
      ) {
        console.log("Invalid selection detected");
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Invalid selection. Please try again."
        );
        await sendDependentOptions(user, dependents);
      } else {
        const selectedDependent = dependents[selectedIndex];
        console.log("Selected dependent:", JSON.stringify(selectedDependent));
        user.conversationState.data.set("selectedDependent", selectedDependent);
        console.log(
          "Conversation state after setting selectedDependent:",
          JSON.stringify(user.conversationState.data)
        );
        user.conversationState.currentStep = "UPLOAD_PRESCRIPTION";
        await user.save();
        console.log(
          "User saved. Current conversation state:",
          JSON.stringify(user.conversationState)
        );

        await sendWhatsAppMessage(
          user.phoneNumber,
          `Selected dependent: ${selectedDependent.name} (Dependent Number: ${selectedDependent.dependentNumber})\n\nPlease upload a clear photo of your prescription or type 'done' if you've finished uploading. Make sure to double-check the image for clarity before submitting.\n\nEnter 'b' to go back to the previous step.`
        );
      }
      break;
    case "UPLOAD_PRESCRIPTION":
      logMessageFlow("Handling UPLOAD_PRESCRIPTION step");
      const selectedDependent =
        user.conversationState.data.get("selectedDependent");
      const prescriptionFor =
        user.conversationState.data.get("prescriptionFor");

      if (message.type === "image") {
        logPrescriptionImage("Image detected in the message");
        try {
          const mediaId = message.image.id;
          logMessageFlow(`Media ID: ${mediaId}`);

          const mediaUrl = await getMediaUrl(mediaId);
          logMessageFlow(`Media URL: ${mediaUrl}`);

          const imageBuffer = await downloadMedia(mediaUrl);
          logMessageFlow(`Downloaded image, size: ${imageBuffer.length} bytes`);

          if (imageBuffer.length === 0) {
            throw new Error("Downloaded image is empty");
          }

          let contentType = "image/jpeg"; // Default to JPEG
          if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
            contentType = "image/png";
          } else if (imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8) {
            contentType = "image/jpeg";
          }
          logMessageFlow(`Detected image content type: ${contentType}`);

          const tempOrder = await createOrUpdateTempOrder(user, {
            data: imageBuffer,
            contentType: contentType,
          });

          logPrescriptionImage(
            `Prescription image ${tempOrder.prescriptionImages.length} added to temporary order`
          );

          let confirmationMessage = `Prescription image ${tempOrder.prescriptionImages.length} received.`;
          if (prescriptionFor === "Dependent Member" && selectedDependent) {
            confirmationMessage += ` This prescription is for ${selectedDependent.name} (Dependent Number: ${selectedDependent.dependentNumber}).`;
          }
          confirmationMessage += ` You can upload up to ${
            6 - tempOrder.prescriptionImages.length
          } more images or type 'done' to proceed to the next step.`;

          await sendWhatsAppMessage(user.phoneNumber, confirmationMessage);

          if (tempOrder.prescriptionImages.length >= 6) {
            user.conversationState.currentStep = "DELIVERY_METHOD";
            await user.save();
            logPrescriptionImage(
              `Maximum number of images (6) reached. Total images: ${tempOrder.prescriptionImages.length}`
            );
            await sendWhatsAppMessage(
              user.phoneNumber,
              "Maximum number of prescription images (6) reached. Moving to the next step."
            );
            await sendDeliveryOptions(user);
          }
        } catch (error) {
          logError(`Error processing prescription image: ${error.message}`);
          logError(error.stack);
          await sendWhatsAppMessage(
            user.phoneNumber,
            "We encountered an error processing your prescription image. Please try uploading it again."
          );
        }
      } else if (
        message.type === "text" &&
        message.text.body.toLowerCase() === "done"
      ) {
        logMessageFlow("User finished uploading prescription images");
        const tempOrder = await TempOrder.findOne({
          user: user._id,
          orderType:
            user.conversationState.data.get("orderType") || "NEW_PRESCRIPTION",
        });
        if (tempOrder) {
          logPrescriptionImage(
            `Total images uploaded: ${tempOrder.prescriptionImages.length}`
          );
        }
        user.conversationState.currentStep = "DELIVERY_METHOD";
        await user.save();
        await sendDeliveryOptions(user);
      } else {
        logMessageFlow("Invalid input for UPLOAD_PRESCRIPTION step");
        let reminderMessage =
          "Please upload a photo of your prescription or type 'done' if you've finished uploading.";
        if (prescriptionFor === "Dependent Member" && selectedDependent) {
          reminderMessage += ` Remember, this prescription is for ${selectedDependent.name} (Dependent Number: ${selectedDependent.dependentNumber}).`;
        }
        reminderMessage += "\n\nEnter 'b' to go back to the previous step.";
        await sendWhatsAppMessage(user.phoneNumber, reminderMessage);
      }
      break;
    case "OTC_MEDICATION_LIST":
      logMessageFlow("Handling OTC_MEDICATION_LIST step");
      user.conversationState.data.set("medications", messageContent);
      user.conversationState.currentStep = "DELIVERY_METHOD";
      await user.save();
      await sendDeliveryOptions(user);
      break;
    case "DELIVERY_METHOD":
      logMessageFlow("Handling DELIVERY_METHOD step");
      await handleDeliveryMethod(user, message);
      break;
    case "SELECT_PHARMACY":
      logMessageFlow("Handling SELECT_PHARMACY step");
      await handlePharmacySelection(user, messageContent);
      break;
    case "DELIVERY_ADDRESS_TYPE":
      logMessageFlow("Handling DELIVERY_ADDRESS_TYPE step");
      await handleDeliveryAddressType(user, messageContent);
      break;
    case "ENTER_WORK_ADDRESS":
    case "ENTER_HOME_ADDRESS":
      logMessageFlow(`Handling ${user.conversationState.currentStep} step`);
      await handleAddressEntry(user, messageContent);
      break;
    case "SELECT_WORK_ADDRESS":
    case "SELECT_HOME_ADDRESS":
      logMessageFlow(`Handling ${user.conversationState.currentStep} step`);
      await handleAddressSelection(user, messageContent);
      break;
    case "CONFIRM_SAVE_ADDRESS":
      logMessageFlow("Handling CONFIRM_SAVE_ADDRESS step");
      await handleSaveAddressConfirmation(user, messageContent);
      break;
    case "ENTER_EXTRA_NOTES":
      logMessageFlow("Handling ENTER_EXTRA_NOTES step");
      if (messageContent.toLowerCase() !== "no") {
        user.conversationState.data.set("extraNotes", messageContent);
      }
      user.conversationState.currentStep = "SELECT_DELIVERY_SCHEDULE";
      await user.save();
      const { activeOptions, allPassed } = await sendDeliveryScheduleOptions(
        user
      );
      user.conversationState.data.set("activeDeliveryOptions", activeOptions);
      user.conversationState.data.set("allSchedulesPassed", allPassed);
      break;
    case "SELECT_DELIVERY_SCHEDULE":
      logMessageFlow("Handling SELECT_DELIVERY_SCHEDULE step");
      const activeDeliveryOptions = user.conversationState.data.get(
        "activeDeliveryOptions"
      );
      const allSchedulesPassed =
        user.conversationState.data.get("allSchedulesPassed");

      if (messageContent === "Continue") {
        await sendOrderConfirmation(user);
        break;
      } else if (messageContent === "Cancel Order") {
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Your order has been cancelled. Returning to the main menu."
        );
        await returnToMainMenu(user);
        break;
      }

      if (!allSchedulesPassed) {
        const selectedOption = parseInt(messageContent);
        if (
          isNaN(selectedOption) ||
          !activeDeliveryOptions.includes(selectedOption)
        ) {
          await sendWhatsAppMessage(
            user.phoneNumber,
            "Invalid selection. Please choose a valid delivery schedule or select 'Continue' or 'Cancel Order'."
          );
          await sendDeliveryScheduleOptions(user);
          break;
        }

        const schedules = [
          "09:30 AM - 11:00 AM",
          "11:00 AM - 12:30 PM",
          "01:30 PM - 03:00 PM",
          "03:00 PM - 04:30 PM",
          "04:30 PM - 06:00 PM",
        ];

        const selectedSchedule = schedules[selectedOption - 1];
        user.conversationState.data.set("deliverySchedule", selectedSchedule);
      }

      await sendOrderConfirmation(user);
      break;
    case "CONFIRM_ORDER":
      logMessageFlow("Handling CONFIRM_ORDER step");
      await handleOrderConfirmation(user, messageContent);
      break;
    case "SELECT_REFILL":
      logMessageFlow("Handling SELECT_REFILL step");
      await handleRefillSelection(user, messageContent);
      break;
    case "SELECT_REFILL_PRESCRIPTIONS":
      await handleRefillPrescriptionSelection(user, messageContent);
      break;
    default:
      logError(
        `Invalid step in order process: ${user.conversationState.currentStep}`
      );
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid step in order process. Returning to main menu."
      );
      await clearTempOrder(user._id);
      user.conversationState = {
        currentFlow: "MAIN_MENU",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendMainMenu(user);
  }

  logMessageFlow("--- Exiting handlePlaceOrder ---");
}

// ADDED: New function to handle address entry
async function handleAddressEntry(user, address) {
  const addressType =
    user.conversationState.currentStep === "ENTER_WORK_ADDRESS"
      ? "work"
      : "home";
  user.conversationState.data.set(`${addressType}Address`, address);

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Would you like to save this address for future use?",
    ["Yes", "No"]
  );
  user.conversationState.currentStep = "CONFIRM_SAVE_ADDRESS";
  await user.save();
}

// ADDED: New function to handle address selection
async function handleAddressSelection(user, selection) {
  const addressType = user.conversationState.currentStep.includes("WORK")
    ? "work"
    : "home";
  const addresses = user.addresses[addressType].filter((addr) => addr.isSaved);

  if (selection === `${addresses.length + 1}`) {
    user.conversationState.currentStep = `ENTER_${addressType.toUpperCase()}_ADDRESS`;
    await user.save();
    await sendWhatsAppMessage(
      user.phoneNumber,
      `Please enter your ${addressType} address.`
    );
  } else {
    const index = parseInt(selection) - 1;
    if (index >= 0 && index < addresses.length) {
      user.conversationState.data.set(
        `${addressType}Address`,
        addresses[index].address
      );
      await sendExtraNotesPrompt(user);
    } else {
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid selection. Please try again."
      );
    }
  }
}

// ADDED: New function to handle save address confirmation
async function handleSaveAddressConfirmation(user, response) {
  const addressType = user.conversationState.data.get("workAddress")
    ? "work"
    : "home";
  const address = user.conversationState.data.get(`${addressType}Address`);

  if (response.toLowerCase() === "yes") {
    user.addresses[addressType].push({ address, isSaved: true });
    await user.save();
    await sendWhatsAppMessage(
      user.phoneNumber,
      `Your ${addressType} address has been saved.`
    );
  }

  await sendExtraNotesPrompt(user);
}

async function createOrUpdateTempOrder(user, newImage) {
  try {
    console.log("Entering createOrUpdateTempOrder function");
    console.log("User ID:", user._id);
    console.log(
      "Order Type:",
      user.conversationState.data.get("orderType") || "NEW_PRESCRIPTION"
    );

    if (!TempOrder) {
      console.error("TempOrder model is undefined");
      throw new Error("TempOrder model is not properly imported");
    }

    let tempOrder = await TempOrder.findOne({
      user: user._id,
      orderType:
        user.conversationState.data.get("orderType") || "NEW_PRESCRIPTION",
    });

    if (!tempOrder) {
      console.log("Creating new TempOrder");
      tempOrder = new TempOrder({
        user: user._id,
        orderType:
          user.conversationState.data.get("orderType") || "NEW_PRESCRIPTION",
        prescriptionImages: [],
      });
    } else {
      console.log("Updating existing TempOrder");
    }

    tempOrder.prescriptionImages.push(newImage);
    await tempOrder.save();

    console.log("TempOrder saved successfully");
    return tempOrder;
  } catch (error) {
    console.error("Error in createOrUpdateTempOrder:", error);
    throw error;
  }
}

// Run cleanup job every hour
cron.schedule("0 * * * *", async () => {
  console.log("Running temporary order cleanup job");
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const result = await TempOrder.deleteMany({
      createdAt: { $lt: thirtyMinutesAgo },
    });
    console.log(`Deleted ${result.deletedCount} expired temporary orders`);
  } catch (error) {
    console.error("Error in temporary order cleanup job:", error);
  }
});

async function sendExtraNotesPrompt(user) {
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Do you have any special instructions for the delivery officer or pharmacist? If yes, please enter them now. If not, enter 'No'."
  );
  user.conversationState.currentStep = "ENTER_EXTRA_NOTES";
  await user.save();
}

// ADDED: New function to handle extra notes
async function handleExtraNotes(user, notes) {
  if (notes.toLowerCase() !== "no") {
    user.conversationState.data.set("extraNotes", notes);
  }
  await sendOrderConfirmation(user);
}

async function sendOrderConfirmation(user) {
  const orderData = user.conversationState.data;

  // First, send prescription images if any
  const tempOrder = await TempOrder.findOne({
    user: user._id,
    orderType: orderData.get("orderType") || "NEW_PRESCRIPTION",
  });

  if (tempOrder && tempOrder.prescriptionImages.length > 0) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      `You have uploaded ${tempOrder.prescriptionImages.length} prescription image(s). Please review them:`
    );
    for (let i = 0; i < tempOrder.prescriptionImages.length; i++) {
      const image = tempOrder.prescriptionImages[i];
      await sendWhatsAppImage(
        user.phoneNumber,
        image.data,
        `Prescription Image ${i + 1}`
      );
    }
  }

  // Now, send the order confirmation message
  let confirmationMessage = "Please confirm your order details:\n\n";
  confirmationMessage += `Order Type: ${orderData.get("orderType")}\n`;
  confirmationMessage += `Delivery Method: ${orderData.get(
    "deliveryMethod"
  )}\n`;

  // Add selected prescriptions information
  const selectedOrder = orderData.get("selectedRefillOrder");
  const selectedPrescriptions = orderData.get("selectedPrescriptions");

  if (selectedOrder && selectedOrder.prescriptionImages) {
    if (selectedPrescriptions === "all") {
      confirmationMessage += `Selected Prescriptions: All (${selectedOrder.prescriptionImages.length})\n`;
    } else if (Array.isArray(selectedPrescriptions)) {
      confirmationMessage += `Selected Prescriptions: ${selectedPrescriptions
        .map((index) => index + 1)
        .join(", ")}\n`;
    }
  }

  const prescriptionFor = orderData.get("prescriptionFor") || "Main Member";
  console.log("Prescription For:", prescriptionFor);
  confirmationMessage += `Prescription For: `;
  if (prescriptionFor === "Main Member") {
    confirmationMessage += `${user.firstName} ${user.lastName} (Main Member)\n`;
    console.log("Main Member selected:", user.firstName, user.lastName);
  } else if (
    prescriptionFor === "Dependent Member" ||
    prescriptionFor === "Main & Dependent"
  ) {
    const selectedDependent = orderData.get("selectedDependent");
    console.log(
      "Selected Dependent from orderData:",
      JSON.stringify(selectedDependent)
    );
    if (selectedDependent && selectedDependent.name) {
      confirmationMessage += `${selectedDependent.name} `;
      if (selectedDependent.dependentNumber) {
        confirmationMessage += `(Dependent Number: ${selectedDependent.dependentNumber})`;
      } else {
        confirmationMessage += `(Dependent)`;
      }
      confirmationMessage += `\n`;
      console.log("Dependent information added to confirmation message");
    } else {
      confirmationMessage += `${prescriptionFor} (Details not available)\n`;
      console.log("Dependent details not available");
    }
  } else {
    confirmationMessage += `${prescriptionFor}\n`;
    console.log("Unknown prescription for type:", prescriptionFor);
  }
  console.log(
    "Final confirmation message for prescription:",
    confirmationMessage
  );

  if (orderData.get("deliveryMethod") === "Delivery") {
    const addressType = orderData.get("workAddress") ? "Work" : "Home";
    confirmationMessage += `Delivery Address (${addressType}): ${orderData.get(
      `${addressType.toLowerCase()}Address`
    )}\n`;
    confirmationMessage += `Delivery Schedule: ${orderData.get(
      "deliverySchedule"
    )}\n`;
    if (orderData.get("deliveryDate")) {
      confirmationMessage += `Delivery Date: ${orderData.get(
        "deliveryDate"
      )}\n`;
    }
  } else {
    const pharmacy = await Pharmacy.findById(orderData.get("selectedPharmacy"));
    confirmationMessage += `Pickup Pharmacy: ${pharmacy.name}\n`;
  }

  if (orderData.get("extraNotes")) {
    confirmationMessage += `Special Instructions: ${orderData.get(
      "extraNotes"
    )}\n`;
  }

  if (tempOrder && tempOrder.prescriptionImages.length > 0) {
    confirmationMessage += `\nUploaded Prescription Images: ${tempOrder.prescriptionImages.length}\n`;
  }

  confirmationMessage +=
    "\nIs this information correct? Would you like to proceed with the order?";

  // Send prescription images
  if (selectedOrder && selectedOrder.prescriptionImages) {
    const imagesToSend =
      selectedPrescriptions === "all"
        ? selectedOrder.prescriptionImages
        : selectedPrescriptions.map(
            (index) => selectedOrder.prescriptionImages[index]
          );

    await sendWhatsAppMessage(
      user.phoneNumber,
      "Selected Prescription Images:"
    );
    for (let i = 0; i < imagesToSend.length; i++) {
      await sendWhatsAppImage(
        user.phoneNumber,
        imagesToSend[i].data,
        `Selected Prescription Image ${i + 1}`
      );
    }
  }

  await sendWhatsAppMessage(user.phoneNumber, confirmationMessage, [
    "Yes",
    "No",
  ]);

  user.conversationState.currentStep = "CONFIRM_ORDER";
  await user.save();
}

// ADDED: New function to handle order confirmation
async function handleOrderConfirmation(user, response) {
  if (response.toLowerCase() === "yes") {
    await finishOrder(user);
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Order cancelled. Returning to main menu."
    );
    await clearTempOrder(user._id);
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
  }
}

async function handlePharmacySelection(user, message) {
  if (message === "b" || message === "B") {
    user.conversationState.currentStep = "DELIVERY_METHOD";
    await user.save();
    await sendDeliveryOptions(user);
    return;
  }

  const pharmacies = user.conversationState.data.get("pharmacies");
  if (!pharmacies || pharmacies.length === 0) {
    console.error("Pharmacies not found in user conversation state");
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We encountered an error with pharmacy selection. Please try again."
    );
    await sendPharmacyOptions(user);
    return;
  }

  const selectedIndex = parseInt(message) - 1;

  if (
    isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= pharmacies.length
  ) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid selection. Please enter a valid pharmacy number or b to go back to the previous step."
    );
    return;
  }

  const selectedPharmacy = pharmacies[selectedIndex];
  user.conversationState.data.set("selectedPharmacy", selectedPharmacy._id);
  await user.save();

  console.log("Selected pharmacy:", selectedPharmacy);

  await sendWhatsAppMessage(
    user.phoneNumber,
    `Thank you for choosing pickup. You can collect your medication from:\n\n${selectedPharmacy.name}\n${selectedPharmacy.address}\n\nWe'll notify you when your order is ready for pickup.`
  );

  await finishOrder(user);
}

async function sendPrescriptionOptions(user) {
  const message = "Prescription Options:";
  const buttons = ["Prescription Refill", "New Prescription"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter 0 to go back to Main Menu\nEnter b to go back to the previous step."
  );
}

async function handleViewOrderResponse(user, message) {
  if (message === "Yes") {
    const orderId = user.conversationState.data.get("orderId");
    const order = await Order.findById(orderId);

    if (order) {
      const orderDetails = `Order Details:
Order Number: ${order.orderNumber}
Date: ${order.createdAt.toDateString()}
*Status: ${order.status}*
Type: ${order.orderType}
Delivery Method: ${order.deliveryMethod}
${order.prescriptionFor ? `Prescription For: ${order.prescriptionFor}` : ""}`;

      if (
        order.orderType !== "OVER_THE_COUNTER" &&
        order.prescriptionImage &&
        order.prescriptionImage.data
      ) {
        await sendWhatsAppImage(
          user.phoneNumber,
          order.prescriptionImage.data,
          orderDetails
        );
      } else if (order.orderType === "OVER_THE_COUNTER") {
        const otcDetails = `${orderDetails}\n\nMedications:\n${order.medications
          .map((med) => `- ${med.name}`)
          .join("\n")}`;
        await sendWhatsAppMessage(user.phoneNumber, otcDetails);
      } else {
        await sendWhatsAppMessage(user.phoneNumber, orderDetails);
      }
    } else {
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Sorry, we couldn't find your order details."
      );
    }
  } else if (message !== "No") {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid option. Please try again."
    );
    return;
  }

  // Return to main menu
  user.conversationState = {
    currentFlow: "MAIN_MENU",
    currentStep: null,
    data: new Map(),
    lastUpdated: new Date(),
  };
  await user.save();
  await sendMainMenu(user);
}
// --------------------------------------------------------
// -------------------------------------------------------
async function sendRefillOptions(user) {
  console.log("\n--- Entering sendRefillOptions ---");

  const prescriptionOrders = await Order.find({
    user: user._id,
    orderType: { $in: ["PRESCRIPTION_REFILL", "NEW_PRESCRIPTION"] },
  })
    .sort({ createdAt: -1 })
    .limit(100);

  if (prescriptionOrders.length === 0) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "You don't have any previous prescription orders to refill.\n\nEnter b to go back to the previous step."
    );
    console.log("--- Exiting sendRefillOptions (no orders) ---\n");
    return;
  }

  let message = "Select a prescription to refill:\n\n";
  prescriptionOrders.forEach((order, index) => {
    message += `${index + 1}. ${
      order.orderNumber
    } - ${order.createdAt.toDateString()}\n`;
  });
  message +=
    "\nEnter the number of the prescription you want to refill, or b to go back to the previous step.";

  await sendWhatsAppMessage(user.phoneNumber, message);

  // Update conversation state to handle refill selection
  user.conversationState.currentStep = "SELECT_REFILL";
  user.conversationState.data.set("prescriptionOrders", prescriptionOrders);
  user.conversationState.data.set("orderType", "PRESCRIPTION_REFILL");
  await user.save();

  console.log("--- Exiting sendRefillOptions ---\n");
}
async function handleRefillSelection(user, message) {
  console.log("\n--- Entering handleRefillSelection ---");

  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  }

  console.log("Processed message content:", messageContent);

  if (messageContent === "") {
    await sendRefillOptions(user);
    console.log(
      "--- Exiting handleRefillSelection (redisplayed options) ---\n"
    );
    return;
  }

  if (messageContent === "b" || messageContent === "B") {
    user.conversationState.currentStep = "PRESCRIPTION_OPTIONS";
    await user.save();
    await sendPrescriptionOptions(user);
    console.log("--- Exiting handleRefillSelection (went back) ---\n");
    return;
  }

  const prescriptionOrders =
    user.conversationState.data.get("prescriptionOrders");
  if (!prescriptionOrders || prescriptionOrders.length === 0) {
    console.error("Prescription orders not found in user conversation state");
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We encountered an error with prescription selection. Please try again."
    );
    await sendRefillOptions(user);
    console.log(
      "--- Exiting handleRefillSelection (error: no prescription orders) ---\n"
    );
    return;
  }

  const selectedIndex = parseInt(messageContent) - 1;

  if (
    isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= prescriptionOrders.length
  ) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid selection. Please enter a valid prescription number or b to go back to the previous step."
    );
    console.log("--- Exiting handleRefillSelection (invalid selection) ---\n");
    return;
  }

  const selectedOrder = prescriptionOrders[selectedIndex];

  // HIGHLIGHT: Save selected order information
  user.conversationState.data.set("selectedRefillOrder", selectedOrder);

  if (selectedOrder.dependent) {
    user.conversationState.data.set(
      "selectedDependent",
      selectedOrder.dependent
    );
    user.conversationState.data.set("prescriptionFor", "Dependent Member");
  } else {
    user.conversationState.data.set("prescriptionFor", "Main Member");
  }

  await displayOrderDetails(user, selectedOrder);

  // HIGHLIGHT: Display prescription images
  if (
    selectedOrder.prescriptionImages &&
    selectedOrder.prescriptionImages.length > 0
  ) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      `This order has ${selectedOrder.prescriptionImages.length} prescription image(s). Here they are:`
    );
    for (let i = 0; i < selectedOrder.prescriptionImages.length; i++) {
      await sendWhatsAppImage(
        user.phoneNumber,
        selectedOrder.prescriptionImages[i].data,
        `Prescription Image ${i + 1}`
      );
    }

    // HIGHLIGHT: Ask user to select prescriptions
    let selectMessage = "Which prescriptions would you like to refill?\n";
    for (let i = 0; i < selectedOrder.prescriptionImages.length; i++) {
      selectMessage += `${i + 1}. Prescription ${i + 1}\n`;
    }
    selectMessage += `${
      selectedOrder.prescriptionImages.length + 1
    }. All prescriptions\n\nPlease enter the numbers of the prescriptions you want to refill, separated by commas (e.g., 1,3), or enter '${
      selectedOrder.prescriptionImages.length + 1
    }' for all.`;

    await sendWhatsAppMessage(user.phoneNumber, selectMessage);

    user.conversationState.currentStep = "SELECT_REFILL_PRESCRIPTIONS";
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Is this the prescription you'd like to refill?",
      ["Yes", "No"]
    );
    user.conversationState.currentStep = "CONFIRM_REFILL";
  }

  await user.save();

  console.log("--- Exiting handleRefillSelection ---\n");
}

async function handleRefillPrescriptionSelection(user, message) {
  console.log("\n--- Entering handleRefillPrescriptionSelection ---");

  const selectedOrder = user.conversationState.data.get("selectedRefillOrder");
  const totalPrescriptions = selectedOrder.prescriptionImages.length;

  if (message === `${totalPrescriptions + 1}`) {
    // User selected all prescriptions
    user.conversationState.data.set("selectedPrescriptions", "all");
  } else {
    // User selected specific prescriptions
    const selectedIndexes = message
      .split(",")
      .map((num) => parseInt(num.trim()) - 1);
    const validIndexes = selectedIndexes.filter(
      (index) => index >= 0 && index < totalPrescriptions
    );

    if (validIndexes.length === 0) {
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid selection. Please try again."
      );
      return;
    }

    user.conversationState.data.set("selectedPrescriptions", validIndexes);
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Is this the prescription selection you'd like to refill?",
    ["Yes", "No"]
  );

  user.conversationState.currentStep = "CONFIRM_REFILL";
  await user.save();

  console.log("--- Exiting handleRefillPrescriptionSelection ---\n");
}

async function returnToMainMenu(user) {
  await clearTempOrder(user._id);
  user.conversationState = {
    currentFlow: "MAIN_MENU",
    currentStep: null,
    data: new Map(),
    lastUpdated: new Date(),
  };
  await user.save();
  await sendMainMenu(user);
}

async function displayOrderDetails(user, order) {
  let pharmacyInfo = "";
  if (order.deliveryMethod === "Pickup" && order.pickupPharmacy) {
    try {
      const pharmacy = await Pharmacy.findById(order.pickupPharmacy);
      if (pharmacy) {
        pharmacyInfo = `\nPickup Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}`;
      }
    } catch (error) {
      console.error("Error fetching pharmacy details:", error);
      pharmacyInfo = "\nPickup Pharmacy: Information unavailable";
    }
  }

  let prescriptionForInfo = "";
  if (order.prescriptionFor) {
    prescriptionForInfo = `Prescription For: ${order.prescriptionFor}`;
    if (order.dependent && order.dependent.name) {
      prescriptionForInfo += ` - ${order.dependent.name}`;
      if (order.dependent.dependentNumber) {
        prescriptionForInfo += ` (Dependent Number: ${order.dependent.dependentNumber})`;
      }
    }
    prescriptionForInfo += "\n";
  }

  const orderDetails = `Order Details:
Order Number: ${order.orderNumber}
Date: ${order.createdAt.toDateString()}
*Status: ${order.status}*
Type: ${order.orderType}
Delivery Method: ${order.deliveryMethod}${pharmacyInfo}
${prescriptionForInfo}`;

  await sendWhatsAppMessage(user.phoneNumber, orderDetails);

  if (order.prescriptionImages && order.prescriptionImages.length > 0) {
    await sendWhatsAppMessage(user.phoneNumber, "Prescription Images:");
    for (let i = 0; i < order.prescriptionImages.length; i++) {
      const image = order.prescriptionImages[i];
      try {
        await sendWhatsAppImage(
          user.phoneNumber,
          image.data,
          `Prescription Image ${i + 1}`
        );
      } catch (error) {
        console.error(`Error sending prescription image ${i + 1}:`, error);
        await sendWhatsAppMessage(
          user.phoneNumber,
          `Error sending prescription image ${i + 1}.`
        );
      }
    }
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "No prescription images available."
    );
  }
}

async function handleRefillConfirmation(user, message) {
  if (message.toLowerCase() === "yes") {
    const selectedRefillOrder = user.conversationState.data.get(
      "selectedRefillOrder"
    );

    // ADDED: Set the prescription images from the selected order
    if (
      selectedRefillOrder.prescriptionImages &&
      selectedRefillOrder.prescriptionImages.length > 0
    ) {
      user.conversationState.data.set(
        "prescriptionImages",
        selectedRefillOrder.prescriptionImages
      );
    }

    // Set other necessary data for the new refill order
    user.conversationState.data.set("orderType", "PRESCRIPTION_REFILL");
    user.conversationState.data.set(
      "medications",
      selectedRefillOrder.medications
    );
    user.conversationState.data.set(
      "prescriptionFor",
      selectedRefillOrder.prescriptionFor
    );

    user.conversationState.currentStep = "DELIVERY_METHOD";
    await user.save();
    await sendDeliveryOptions(user);
  } else if (message.toLowerCase() === "no") {
    await sendRefillOptions(user);
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Please answer with 'Yes' or 'No'."
    );
  }
}

async function displayOrderDetails(user, order) {
  let pharmacyInfo = "";
  if (order.deliveryMethod === "Pickup" && order.pickupPharmacy) {
    try {
      const pharmacy = await Pharmacy.findById(order.pickupPharmacy);
      if (pharmacy) {
        pharmacyInfo = `\nPickup Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}`;
      }
    } catch (error) {
      console.error("Error fetching pharmacy details:", error);
      pharmacyInfo = "\nPickup Pharmacy: Information unavailable";
    }
  }

  const orderDetails = `Order Details:
Order Number: ${order.orderNumber}
Date: ${order.createdAt.toDateString()}
*Status: ${order.status}*
Type: ${order.orderType}
Delivery Method: ${order.deliveryMethod}${pharmacyInfo}
${order.prescriptionFor ? `Prescription For: ${order.prescriptionFor}` : ""}`;

  if (order.prescriptionImage && order.prescriptionImage.data) {
    await sendWhatsAppImage(
      user.phoneNumber,
      order.prescriptionImage.data,
      orderDetails
    );
  } else {
    await sendWhatsAppMessage(user.phoneNumber, orderDetails);
  }
}

async function sendNewPrescriptionOptions(user) {
  console.log("Entering sendNewPrescriptionOptions function");
  const message = "Who is the prescription for?";
  const buttons = ["Main Member", "Dependent Member", "Main & Dependent"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter b to go back to the previous step."
  );
  console.log("New prescription options sent to user");
}

async function sendDeliveryOptions(user) {
  const message =
    "Would you like the medication to be delivered, or will you be picking it up?";
  const buttons = ["Delivery", "Pickup"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter 0 to go back to Main Menu\nEnter b to go back to the previous step."
  );
}

async function handleDeliveryMethod(user, message) {
  console.log("\n--- Entering handleDeliveryMethod ---");

  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log(
      "Unhandled message type in handleDeliveryMethod:",
      message.type
    );
    messageContent = "UNKNOWN";
  }

  switch (messageContent) {
    case "Delivery":
      user.conversationState.currentStep = "DELIVERY_ADDRESS_TYPE";
      user.conversationState.data.set("deliveryMethod", "Delivery");
      await user.save();
      await sendDeliveryAddressOptions(user);
      break;
    case "Pickup":
      user.conversationState.currentStep = "SELECT_PHARMACY";
      user.conversationState.data.set("deliveryMethod", "Pickup");
      await user.save();
      await sendPharmacyOptions(user);
      break;
    case "0":
      user.conversationState = {
        currentFlow: "MAIN_MENU",
        currentStep: null,
        data: new Map(),
        lastUpdated: new Date(),
      };
      await user.save();
      await sendMainMenu(user);
      break;
    case "b":
    case "B":
      console.log("User pressed 'b' to go back");
      if (
        user.conversationState.data.get("orderType") === "PRESCRIPTION_REFILL"
      ) {
        console.log("Going back to SELECT_REFILL");
        user.conversationState.currentStep = "SELECT_REFILL";
        await user.save();
        console.log(
          "Updated user state:",
          JSON.stringify(user.conversationState, null, 2)
        );
        await sendRefillOptions(user);
      } else {
        const previousStep =
          user.conversationState.data.get("orderType") === "OVER_THE_COUNTER"
            ? "OTC_MEDICATION_LIST"
            : "NEW_PRESCRIPTION_FOR";
        user.conversationState.currentStep = previousStep;
        await user.save();
        if (previousStep === "OTC_MEDICATION_LIST") {
          await sendWhatsAppMessage(
            user.phoneNumber,
            "Please enter a list of medications you would like to order.\n\nEnter b to go back to the previous step."
          );
        } else {
          await sendNewPrescriptionOptions(user);
        }
      }
      break;
    default:
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid option. Please try again."
      );
      await sendDeliveryOptions(user);
  }
  console.log("--- Exiting handleDeliveryMethod ---\n");
}

async function sendPharmacyOptions(user) {
  const pharmacies = await Pharmacy.find({ isActive: true });

  if (pharmacies.length === 0) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We're sorry, but there are no pharmacies available for pickup at the moment. Please choose delivery instead."
    );
    user.conversationState.currentStep = "DELIVERY_METHOD";
    await user.save();
    await sendDeliveryOptions(user);
    return;
  }

  let message = "Please select a pharmacy for pickup:\n\n";
  pharmacies.forEach((pharmacy, index) => {
    message += `${index + 1}. ${pharmacy.name}\n`;
  });
  message +=
    "\nEnter the number of your chosen pharmacy, or b to go back to the previous step.";

  await sendWhatsAppMessage(user.phoneNumber, message);

  user.conversationState.data.set("pharmacies", pharmacies);
  await user.save();
}

async function sendDeliveryAddressOptions(user) {
  const message = "Where do you want your medication to be delivered?";
  const buttons = ["Work", "Home"];
  await sendWhatsAppMessage(user.phoneNumber, message, buttons);
  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter b to go back to the previous step."
  );
}

async function handleDeliveryAddressType(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log(
      "Unhandled message type in handleDeliveryAddressType:",
      message.type
    );
    messageContent = "UNKNOWN";
  }

  // ADDED: Initialize addresses if they don't exist
  if (!user.addresses) {
    user.addresses = { home: [], work: [] };
    await user.save();
  }

  switch (messageContent) {
    case "Work":
      if (
        user.addresses.work &&
        user.addresses.work.some((addr) => addr.isSaved)
      ) {
        await sendSavedAddresses(user, "work");
      } else {
        user.conversationState.currentStep = "ENTER_WORK_ADDRESS";
        await user.save();
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Please enter your work name and physical address.\n\nEnter b to go back to the previous step."
        );
      }
      break;
    case "Home":
      if (
        user.addresses.home &&
        user.addresses.home.some((addr) => addr.isSaved)
      ) {
        await sendSavedAddresses(user, "home");
      } else {
        user.conversationState.currentStep = "ENTER_HOME_ADDRESS";
        await user.save();
        await sendWhatsAppMessage(
          user.phoneNumber,
          "Please enter your home address.\n\nEnter b to go back to the previous step."
        );
      }
      break;
    case "b":
    case "B":
      user.conversationState.currentStep = "DELIVERY_METHOD";
      await user.save();
      await sendDeliveryOptions(user);
      break;
    default:
      await sendWhatsAppMessage(
        user.phoneNumber,
        "Invalid option. Please try again."
      );
      await sendDeliveryAddressOptions(user);
  }
}

// ADDED: New function to send saved addresses
async function sendSavedAddresses(user, addressType) {
  const addresses = user.addresses[addressType].filter((addr) => addr.isSaved);
  let message = `Your saved ${addressType} addresses:\n\n`;
  addresses.forEach((addr, index) => {
    message += `${index + 1}. ${addr.address}\n`;
  });
  message += `${
    addresses.length + 1
  }. Enter a new address\n\nPlease select an option:`;

  await sendWhatsAppMessage(user.phoneNumber, message);
  user.conversationState.currentStep = `SELECT_${addressType.toUpperCase()}_ADDRESS`;
  await user.save();
}

async function finishOrder(user) {
  logMessageFlow("Entered finishOrder function");

  try {
    const orderData = {
      user: user._id,
      orderNumber: generateOrderNumber(),
      orderType:
        user.conversationState.data.get("orderType") || "NEW_PRESCRIPTION",
      deliveryMethod: user.conversationState.data.get("deliveryMethod"),
      status: "PENDING",
      prescriptionFor:
        user.conversationState.data.get("prescriptionFor") || "Main Member",
      extraNotes: user.conversationState.data.get("extraNotes") || "",
      deliverySchedule: user.conversationState.data.get("deliverySchedule"),
    };

    logMessageFlow("Initial orderData: " + JSON.stringify(orderData, null, 2));

    // Retrieve full dependent information if applicable
    const selectedDependent =
      user.conversationState.data.get("selectedDependent");
    logMessageFlow(
      "Selected Dependent from conversation state: " +
        JSON.stringify(selectedDependent, null, 2)
    );

    if (selectedDependent && selectedDependent.id) {
      // Retrieve the full dependent data from the user schema
      const fullUserData = await User.findById(user._id).select("dependents");
      const fullDependentData = fullUserData.dependents.find(
        (dep) => dep.id === selectedDependent.id
      );

      if (fullDependentData) {
        orderData.dependent = {
          dependentNumber: fullDependentData.dependentNumber,
          firstName: fullDependentData.firstName,
          middleName: fullDependentData.middleName,
          lastName: fullDependentData.lastName,
          dateOfBirth: fullDependentData.dateOfBirth,
          id: fullDependentData.id,
        };
        logMessageFlow(
          "Full Dependent information added to orderData: " +
            JSON.stringify(orderData.dependent, null, 2)
        );
      } else {
        logError("Full dependent data not found in user schema");
      }
    } else {
      logMessageFlow("No dependent information to add");
    }

    // Add selected prescriptions to the order
    const selectedOrder = user.conversationState.data.get(
      "selectedRefillOrder"
    );
    const selectedPrescriptions = user.conversationState.data.get(
      "selectedPrescriptions"
    );

    logMessageFlow(
      "Selected Order: " +
        JSON.stringify(
          selectedOrder,
          (key, value) =>
            key === "prescriptionImages" ? `[${value.length} images]` : value,
          null,
          2
        )
    );
    logMessageFlow(
      "Selected Prescriptions: " +
        JSON.stringify(selectedPrescriptions, null, 2)
    );

    if (selectedOrder && selectedOrder.prescriptionImages) {
      if (selectedPrescriptions === "all") {
        orderData.prescriptionImages = selectedOrder.prescriptionImages;
      } else if (Array.isArray(selectedPrescriptions)) {
        orderData.prescriptionImages = selectedPrescriptions.map(
          (index) => selectedOrder.prescriptionImages[index]
        );
      }
      logMessageFlow(
        "Number of prescription images added from selected order: " +
          orderData.prescriptionImages.length
      );
    }

    // Find the temporary order
    const tempOrder = await TempOrder.findOne({
      user: user._id,
      orderType: orderData.orderType,
    });

    logMessageFlow("Temporary Order found: " + (tempOrder ? "Yes" : "No"));

    // Get prescription images from temporary order
    if (tempOrder && tempOrder.prescriptionImages.length > 0) {
      orderData.prescriptionImages = tempOrder.prescriptionImages;
      logPrescriptionImage(
        `Prescription images from temporary order: ${tempOrder.prescriptionImages.length}`
      );
    } else {
      logPrescriptionImage("No prescription images found in temporary order");
    }

    if (orderData.deliveryMethod === "Delivery") {
      const addressType = user.conversationState.data.get("workAddress")
        ? "work"
        : "home";
      orderData.deliveryAddress = {
        type: addressType.charAt(0).toUpperCase() + addressType.slice(1),
        address: user.conversationState.data.get(`${addressType}Address`),
      };
      logMessageFlow(
        "Delivery address added: " +
          JSON.stringify(orderData.deliveryAddress, null, 2)
      );
    } else if (orderData.deliveryMethod === "Pickup") {
      const selectedPharmacyId =
        user.conversationState.data.get("selectedPharmacy");
      if (selectedPharmacyId) {
        orderData.pickupPharmacy = selectedPharmacyId;
        logMessageFlow("Pickup pharmacy added: " + selectedPharmacyId);
      } else {
        logError("Selected pharmacy ID is missing");
        throw new Error("Selected pharmacy ID is missing");
      }
    }

    logMessageFlow(
      `Final order data before saving: ${JSON.stringify(
        orderData,
        (key, value) =>
          key === "prescriptionImages" ? `[${value.length} images]` : value,
        null,
        2
      )}`
    );

    const order = new Order(orderData);
    await order.save();

    logMessageFlow(`Order saved successfully. Order ID: ${order._id}`);
    logMessageFlow(
      `Saved order details: ${JSON.stringify(
        order.toObject(),
        (key, value) =>
          key === "prescriptionImages" ? `[${value.length} images]` : value,
        null,
        2
      )}`
    );
    logPrescriptionImage(
      `Prescription images saved to DB: ${
        order.prescriptionImages ? order.prescriptionImages.length : 0
      }`
    );

    // Delete the temporary order
    if (tempOrder) {
      await TempOrder.deleteOne({ _id: tempOrder._id });
      logMessageFlow("Temporary order deleted");
    }

    let message = `Thank you for your order, ${user.firstName}! Your order number is ${order.orderNumber}. `;
    if (order.deliveryMethod === "Pickup") {
      const pharmacy = await Pharmacy.findById(order.pickupPharmacy);
      if (pharmacy) {
        message += `Your medication will be ready for pickup soon at ${pharmacy.name}. We'll notify you when it's ready.`;
      } else {
        message += `Your medication will be ready for pickup soon. We'll notify you when it's ready.`;
      }
    } else {
      message += "Your medication will be delivered soon.";
    }

    await sendWhatsAppMessage(user.phoneNumber, message);
    logMessageFlow("Order confirmation message sent to user");

    if (order.prescriptionImages && order.prescriptionImages.length > 0) {
      await sendWhatsAppMessage(
        user.phoneNumber,
        `We have received ${order.prescriptionImages.length} prescription image(s) with your order.`
      );
      logMessageFlow(
        `Prescription image confirmation sent: ${order.prescriptionImages.length} images`
      );
    }

    await clearTempOrder(user._id);
    // Reset conversation state
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    logMessageFlow("User conversation state reset to main menu");
    await sendMainMenu(user);
  } catch (error) {
    logError(`Error in finishOrder: ${error.message}`);
    logError(error.stack);
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We encountered an error processing your order. Please try again or contact support."
    );

    await clearTempOrder(user._id);
    // Return to main menu
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    logMessageFlow("User returned to main menu due to error");
    await sendMainMenu(user);
  }

  logMessageFlow("Exiting finishOrder function");
}

function generateOrderNumber() {
  // Generate a unique order number
  const randomPart = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");

  const date = new Date();
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  const datePart = `${dayOfWeek} - ${day} - ${month} - ${year}`;

  return `ORD - ${randomPart} - ${datePart}`;
}

async function handleConversation(user, message) {
  logMessageFlow(`Received message from user ${user.phoneNumber}`);
  logMessageFlow(`Message type: ${message.type}`);

  let messageContent = "";

  if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else if (message.type === "image") {
    messageContent = "IMAGE";
  } else {
    console.log("Unhandled message type:", message.type);
    messageContent = "UNKNOWN";
  }

  // Check if there's an active conversation flow
  if (
    !user.conversationState.currentFlow ||
    user.conversationState.currentFlow === "MAIN_MENU"
  ) {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await handleMainMenu(user, message); // Pass the entire message object
    return;
  }

  logMessageFlow(
    `Current conversation flow: ${user.conversationState.currentFlow}`
  );
  logMessageFlow(
    `Current conversation step: ${user.conversationState.currentStep}`
  );

  // Check for session timeout (30 minutes)
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  if (user.conversationState.lastUpdated < thirtyMinutesAgo) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Your session has timed out. Returning to the main menu."
    );
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  console.log("Processed message content:", messageContent);

  try {
    switch (user.conversationState.currentFlow) {
      case "REGISTRATION":
        await handleRegistration(user, messageContent);
        break;
      case "VIEW_ORDER_STATUS":
        if (user.conversationState.currentStep === "SELECT_ORDER") {
          await handleOrderSelection(user, messageContent);
        } else {
          await handleViewOrderStatus(user, messageContent);
        }
        break;
      case "PLACE_ORDER":
        if (user.conversationState.currentStep === "SELECT_REFILL") {
          await handleRefillSelection(user, messageContent);
        } else if (user.conversationState.currentStep === "CONFIRM_REFILL") {
          await handleRefillConfirmation(user, messageContent);
        } else {
          await handlePlaceOrder(user, message);
        }
        break;
      case "VIEW_ORDER_DETAILS":
        await handleViewOrderResponse(user, messageContent);
        break;
      case "MEDICATION_DELIVERY":
        await handleMedicationDelivery(user, messageContent);
        break;
      case "PHARMACY_CONSULTATION":
        await handlePharmacyConsultation(user, messageContent);
        break;
      case "DOCTOR_CONSULTATION":
        await handleDoctorConsultation(user, messageContent);
        break;
      case "GENERAL_ENQUIRY":
        await handleGeneralEnquiry(user, messageContent);
        break;
      case "EDIT_PROFILE":
        await handleProfileEdit(user, message);
        break;
      default:
        logError(
          `Unknown conversation flow: ${user.conversationState.currentFlow}`
        );
        throw new Error("Unknown conversation flow");
    }
  } catch (error) {
    logError(`Error in conversation handler: ${error.message}`);
    logError(error.stack);
    await sendWhatsAppMessage(
      user.phoneNumber,
      "We encountered an unexpected error. Returning to the main menu."
    );
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
  }

  // Update the last interaction time
  user.lastInteraction = new Date();
  await user.save();
}

async function handleViewOrderStatus(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log(
      "Unhandled message type in handleViewOrderStatus:",
      message.type
    );
    messageContent = "UNKNOWN";
  }

  if (messageContent === "b" || messageContent === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  // Fetch the last 10 orders for the user
  const orders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  if (orders.length === 0) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "You don't have any orders yet.\n\nEnter b to go back to the main menu."
    );
  } else {
    let orderList = "Your last 10 orders:\n\n";
    orders.forEach((order, index) => {
      orderList += `${index + 1}. ${
        order.orderNumber
      } - ${order.createdAt.toDateString()}\n`;
    });
    orderList +=
      "\nEnter the number of the order to view details, or b to go back to the main menu.";

    await sendWhatsAppMessage(user.phoneNumber, orderList);

    // Update conversation state to handle order selection
    user.conversationState.currentStep = "SELECT_ORDER";
    user.conversationState.data.set("orders", orders);
    await user.save();
  }
}

async function handleOrderSelection(user, message) {
  let messageContent = "";
  if (typeof message === "string") {
    messageContent = message;
  } else if (message.type === "text") {
    messageContent = message.text.body;
  } else if (
    message.type === "interactive" &&
    message.interactive.type === "button_reply"
  ) {
    messageContent = message.interactive.button_reply.title;
  } else {
    console.log(
      "Unhandled message type in handleOrderSelection:",
      message.type
    );
    messageContent = "UNKNOWN";
  }

  if (messageContent.toLowerCase() === "b") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  if (messageContent === "0") {
    await handleViewOrderStatus(user, messageContent);
    return;
  }

  const orders = user.conversationState.data.get("orders");
  const selectedIndex = parseInt(messageContent) - 1;

  if (
    isNaN(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= orders.length
  ) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "Invalid selection. Please enter a valid order number, 'b' to go back to the main menu, or '0' to view orders again."
    );
    return;
  }

  const selectedOrder = orders[selectedIndex];

  console.log("\n--- Selected Order Details ---");
  console.log(JSON.stringify(selectedOrder, null, 2));

  let pharmacyInfo = "";
  if (
    selectedOrder.deliveryMethod === "Pickup" &&
    selectedOrder.pickupPharmacy
  ) {
    try {
      const pharmacy = await Pharmacy.findById(selectedOrder.pickupPharmacy);
      if (pharmacy) {
        pharmacyInfo = `\nPickup Pharmacy: ${pharmacy.name}\nAddress: ${pharmacy.address}`;
      }
    } catch (error) {
      console.error("Error fetching pharmacy details:", error);
      pharmacyInfo = "\nPickup Pharmacy: Information unavailable";
    }
  }

  const orderDetails = `Order Details:
Order Number: ${selectedOrder.orderNumber}
Date: ${selectedOrder.createdAt.toDateString()}
*Status: ${selectedOrder.status}*
Type: ${selectedOrder.orderType}
Delivery Method: ${selectedOrder.deliveryMethod}${pharmacyInfo}
${
  selectedOrder.prescriptionFor
    ? `Prescription For: ${selectedOrder.prescriptionFor}`
    : ""
}`;

  await sendWhatsAppMessage(user.phoneNumber, orderDetails);

  if (
    selectedOrder.prescriptionImages &&
    selectedOrder.prescriptionImages.length > 0
  ) {
    await sendWhatsAppMessage(
      user.phoneNumber,
      `Prescription Images (${selectedOrder.prescriptionImages.length}):`
    );
    for (let i = 0; i < selectedOrder.prescriptionImages.length; i++) {
      const image = selectedOrder.prescriptionImages[i];
      try {
        await sendWhatsAppImage(
          user.phoneNumber,
          image.data,
          `Prescription Image ${i + 1}`
        );
      } catch (error) {
        console.error(`Error sending prescription image ${i + 1}:`, error);
        await sendWhatsAppMessage(
          user.phoneNumber,
          `Error sending prescription image ${i + 1}.`
        );
      }
    }
  } else {
    await sendWhatsAppMessage(
      user.phoneNumber,
      "No prescription images available for this order."
    );
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Enter 'b' to go back to the main menu or '0' to view orders again."
  );

  // Reset the conversation state to allow viewing orders again
  user.conversationState.currentStep = null;
  await user.save();

  console.log("\n--- End of handleOrderSelection ---");
}

async function handleMedicationDelivery(user, message) {
  if (message === "b" || message === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    `Your medication will be delivered to ${message}.\n\nEnter b to go back to the main menu.`
  );
}

async function handlePharmacyConsultation(user, message) {
  if (message === "b" || message === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Thank you. A pharmacy consultant will get back to you shortly.\n\nEnter b to go back to the main menu."
  );
}

async function handleDoctorConsultation(user, message) {
  if (message === "b" || message === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Thank you. A doctor will get back to you shortly.\n\nEnter b to go back to the main menu."
  );
}

async function handleGeneralEnquiry(user, message) {
  if (message === "b" || message === "B") {
    user.conversationState = {
      currentFlow: "MAIN_MENU",
      currentStep: null,
      data: new Map(),
      lastUpdated: new Date(),
    };
    await user.save();
    await sendMainMenu(user);
    return;
  }

  await sendWhatsAppMessage(
    user.phoneNumber,
    "Thank you. We will address your enquiry as soon as possible.\n\nEnter b to go back to the main menu."
  );
}

// Periodic cleanup function
async function cleanupStaleConversationStates() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  try {
    await User.updateMany(
      { "conversationState.lastUpdated": { $lt: oneHourAgo } },
      {
        $set: {
          "conversationState.currentFlow": "MAIN_MENU",
          "conversationState.currentStep": null,
          "conversationState.data": {},
          "conversationState.lastUpdated": new Date(),
        },
      }
    );
    console.log("Cleaned up stale conversation states");
  } catch (error) {
    console.error("Error cleaning up stale conversation states:", error);
  }
}

// Run cleanup every hour
setInterval(cleanupStaleConversationStates, 60 * 60 * 1000);

// Main handler functions
async function handleWebhook(req, res) {
  // console.log("Received webhook:", JSON.stringify(req.body, null, 2));

  const { entry } = req.body;

  if (entry && entry[0].changes && entry[0].changes[0].value.messages) {
    const message = entry[0].changes[0].value.messages[0];
    const from = message.from;

    // console.log("Processing message:", JSON.stringify(message, null, 2));

    try {
      let user = await User.findOne({ phoneNumber: from });

      if (!user) {
        console.log("Creating new user:", from);
        user = new User({
          phoneNumber: from,
          memberType: "Unspecified",
          conversationState: {
            currentFlow: "REGISTRATION",
            currentStep: 0,
            data: new Map(),
            lastUpdated: new Date(),
          },
        });
        await user.save();
        await sendWelcomeMessage(user);
      } else {
        // console.log("Existing user found:", user);
        user.lastInteraction = new Date();
        await user.save();

        if (!user.isRegistrationComplete) {
          await handleRegistration(user, message); // Pass the entire message object
        } else {
          try {
            await handleConversation(user, message); // Pass the entire message object
          } catch (error) {
            console.error("Error in handleConversation:", error);
            await sendWhatsAppMessage(
              from,
              "We encountered an unexpected error. Returning to the main menu."
            );
            user.conversationState = {
              currentFlow: "MAIN_MENU",
              currentStep: null,
              data: new Map(),
              lastUpdated: new Date(),
            };
            await user.save();
            await sendMainMenu(user);
          }
        }
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      await sendWhatsAppMessage(
        from,
        "Sorry, we encountered an error. Please try again or contact support if the issue persists."
      );
    }
  } else {
    console.log("Received webhook with no messages");
  }

  res.sendStatus(200);
}

async function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
}

module.exports = {
  handleWebhook,
  verifyWebhook,
};
