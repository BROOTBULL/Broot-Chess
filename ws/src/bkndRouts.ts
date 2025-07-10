import axios from "axios";

class MoveQueue {
  private queue: any[] = [];
  private isProcessing = false;

  constructor(private backendUrl: string) {}

  addMove(move: any) {
    this.queue.push(move);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

   while (this.queue.length > 0) {
      const currentMove = this.queue[0];

      try {
        const res = await axios.post(`${this.backendUrl}/store-move`, currentMove);

        if (res.status === 200) {
          console.log('✅ Move sent:', currentMove);
          this.queue.shift(); // Remove first item (FIFO)
        } else {
          throw new Error(`Backend responded with ${res.status}`);
        }
      } catch (err: any) {
        console.error('❌ Failed to send move:', err.message);
        await this.delay(1000); // wait before retry
      }
    }

    this.isProcessing = false;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
