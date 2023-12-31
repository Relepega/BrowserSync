/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="chrome" />

import type { Bookmark, OpenTab, TabGroup, BrowserExtension } from '$lib/types'

function traverseBookmarkNode(node: chrome.bookmarks.BookmarkTreeNode): Bookmark {
	const bookmark: Bookmark = {
		id: node.id,
		parentId: node.parentId,
		title: node.title,
		url: node.url
	}

	if (!node.url) {
		const children: Bookmark[] = []

		// @ts-ignore
		for (const child of node.children) {
			children.push(traverseBookmarkNode(child))
		}

		bookmark.children = children
	}

	return bookmark
}

export async function getBookmarks(): Promise<Bookmark[]> {
	const bookmarks: Bookmark[] = []

	const bookmarkTreeNodes = await chrome.bookmarks.getTree()

	// @ts-ignore
	for (const children of bookmarkTreeNodes[0].children) {
		bookmarks.push(traverseBookmarkNode(children))
	}

	return bookmarks
}

export async function getOpenTabs(): Promise<OpenTab[]> {
	const chromeTabs = await chrome.tabs.query({})

	const tabs: OpenTab[] = []

	for (let i = 0; i < chromeTabs.length; i++) {
		const tab = chromeTabs[i]

		tabs.push({
			active: tab.active,
			index: tab.index,
			pinned: tab.pinned,
			groupId: tab.groupId,
			url: tab.url ? tab.url : tab.pendingUrl
		})
	}

	return tabs
}

export async function getTabGroups(): Promise<TabGroup[]> {
	const tgs: TabGroup[] = []

	const TabGroups = await chrome.tabGroups.query({})

	for (let i = 0; i < TabGroups.length; i++) {
		const group = TabGroups[i]

		tgs.push({
			collapsed: group.collapsed,
			color: group.color,
			id: group.id,
			title: group.title
		})
	}

	return tgs
}

export async function getExtensions(): Promise<BrowserExtension[]> {
	const extensions = []
	const installedApps = await chrome.management.getAll()

	for (let i = 0; i < installedApps.length; i++) {
		const app = installedApps[i]

		if (app.type == 'extension') {
			extensions.push({
				id: app.id,
				name: app.shortName,
				storeUrl: app.installType == 'normal' ? `https://chrome.google.com/webstore/detail/${app.id}` : `https://www.google.com/search?&q=${app.name} browser extension`
			})
		}
	}

	return extensions
}
