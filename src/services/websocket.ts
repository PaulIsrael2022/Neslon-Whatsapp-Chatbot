import { io, Socket } from "socket.io-client";

class WebSocketService {
  socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  connect(token: string, user: any) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Authenticate with user data
      this.socket.emit('authenticate', {
        userId: user?._id,
        role: user?.role
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.handleReconnect();
      }
    });

    // Handle order updates
    this.socket.on('orderUpdate', (event) => {
      this.notifyListeners('orderUpdate', event);
    });

    // Handle status updates
    this.socket.on('statusUpdate', (event) => {
      this.notifyListeners('statusUpdate', event);
    });

    // Handle errors
    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.notifyListeners('error', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.socket?.connect();
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.notifyListeners('error', { message: 'Unable to connect to server' });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    }
  }

  // Add event listener
  addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // Remove event listener
  removeEventListener(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  // Notify all listeners of an event
  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }
}

export const websocketService = new WebSocketService();
