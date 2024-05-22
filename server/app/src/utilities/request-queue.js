class RequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(requestFn) {
    this.queue.push(requestFn);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const requestFn = this.queue.shift();

    try {
      await requestFn();
    } catch (error) {
      console.error('Error processing request:', error);
    }

    this.processQueue();
  }
}

export default RequestQueue;