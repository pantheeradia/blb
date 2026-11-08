import { after } from "next/server";

/**
 * Run non-critical work after the response has been sent. Next keeps the
 * server invocation alive for the returned promise, so failures are logged
 * without slowing down the customer-facing request.
 */
export function enqueueBackgroundJob(name: string, job: () => Promise<void>): void {
  after(async () => {
    try {
      await job();
    } catch (error) {
      console.error(`Background job failed: ${name}`, error);
    }
  });
}
