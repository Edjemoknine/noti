export async function blobToAudioData(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();

  const context = new AudioContext({
    sampleRate: 16000,
  });

  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  const samples = audioBuffer.getChannelData(0);

  await context.close();

  return samples;
}
