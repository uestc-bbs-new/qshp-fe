declare class QRCode {
  constructor(el: HTMLCanvasElement, options?: Partial<{
    width: number
    height: number
  }>)
  makeCode(text: string): string
}

export default QRCode
