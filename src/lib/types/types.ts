export type FullBackup = {
	bookmarks?: Bookmark[]
	tabs?: OpenTab[]
	tabGroups?: TabGroup[]
	extensions?: BrowserExtension[]
}

export type Bookmark = {
	id: string
	parentId: string | undefined
	title: string
	url: string | undefined // if null bookmark, is a folder
	children?: Bookmark[]
}

export type OpenTab = {
	active: boolean
	index: number
	pinned: boolean
	groupId: number
	url?: string
}

export type TabGroup = {
	collapsed: boolean
	color: string
	id: number
	title?: string
}

export type BrowserExtension = {
	id?: string
	name: string
	storeUrl?: string
}
