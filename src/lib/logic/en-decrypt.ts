import { Blowfish } from 'egoroof-blowfish'

export async function encrypt(data: string, key: string): Promise<Uint8Array> {
	const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL)
	return bf.encode(data)
}

export async function decrypt(data: Uint8Array, key: string): Promise<string> {
	const bf = new Blowfish(key, Blowfish.MODE.ECB, Blowfish.PADDING.NULL)
	return bf.decode(data).toString()
}
