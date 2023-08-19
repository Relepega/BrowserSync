/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="chrome" />

import type { FullBackup, Bookmark, OpenTab, TabGroup, BrowserExtension } from '$lib/types/types'

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
			url: tab.status == 'complete' ? tab.url : tab.pendingUrl
		})
	}

	return tabs
}

export async function getTabGroups(): Promise<TabGroup[]> {
	const tgs: TabGroup[] = []

	const chromeTgs = await chrome.tabGroups.query({})

	for (let i = 0; i < chromeTgs.length; i++) {
		const group = chromeTgs[i]

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

		if (app.type == 'extension' && app.installType == 'normal') {
			extensions.push({
				id: app.id,
				name: app.shortName,
				storeUrl: `chrome.google.com/webstore/detail/${app.id}`
			})
		}
	}

	return extensions
}
