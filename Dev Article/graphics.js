const canvas = document.getElementById('graph');
export const ctx = canvas.getContext('2d');

export const width = canvas.width;
export const height = canvas.height;

export const clearCanvas = () => ctx.clearRect(0, 0, width, height);
