import axios from 'axios';
import FormData from 'form-data';

class WhatsAppService {
  constructor() {
    this.API_URL = "https://graph.facebook.com/v18.0";
    this.PHONE_NUMBER_ID = process.env.WHATSAPP_CLOUD_API_FROM_PHONE_NUMBER_ID;
    this.ACCESS_TOKEN = process.env.WHATSAPP_CLOUD_API_ACCESS_TOKEN;
  }

  async sendMessage(to, message, media = null) {
    const url = `${this.API_URL}/${this.PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${this.ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };

    try {
      let data;

      if (media) {
        // If media is provided, first upload it
        const mediaId = await this.uploadMedia(media);
        
        data = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: media.contentType.startsWith('image/') ? "image" : "document",
          [media.contentType.startsWith('image/') ? "image" : "document"]: {
            id: mediaId,
            caption: message
          }
        };
      } else {
        data = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { body: message }
        };
      }

      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  async uploadMedia(media) {
    try {
      const formData = new FormData();
      
      const buffer = Buffer.isBuffer(media.data) ? media.data : Buffer.from(media.data);
      
      formData.append("file", buffer, {
        filename: media.filename,
        contentType: media.contentType,
      });
      formData.append("type", media.contentType);
      formData.append("messaging_product", "whatsapp");

      const response = await axios.post(
        `${this.API_URL}/${this.PHONE_NUMBER_ID}/media`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
          },
        }
      );

      return response.data.id;
    } catch (error) {
      console.error('Error uploading media:', error.response?.data || error.message);
      throw error;
    }
  }

  async getMediaUrl(mediaId) {
    try {
      const response = await axios.get(`${this.API_URL}/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error getting media URL:', error.response?.data || error.message);
      throw error;
    }
  }

  async downloadMedia(mediaUrl) {
    try {
      const response = await axios.get(mediaUrl, {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
        },
        timeout: 30000,
      });
      return Buffer.from(response.data, "binary");
    } catch (error) {
      console.error('Error downloading media:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new WhatsAppService();