let recorder: MediaRecorder | null = null;
let chunks: Blob[] = [];

export  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
        chunks.push(e.data);
        }
    };

    recorder.start();
}

export function stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
        if (!recorder) {
            reject(new Error("No recording in progress"));
            return;
        }

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type:recorder?.mimeType || "audio/webm" });
                  recorder!.stream.getTracks().forEach((track) => track.stop());
            resolve(blob);
        };

        recorder.stop();
    });
}