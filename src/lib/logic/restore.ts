/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="chrome" />

import type { FullBackup, Bookmark, OpenTab, TabGroup, BrowserExtension, RestoreOptions } from '$lib/types'

async function restoreExtensions(extensions: BrowserExtension[], restoreStatusNode: HTMLElement) {
	for (const ext of extensions) {
		restoreStatusNode.innerText = `Restoring extension: ${ext.name}`

		await chrome.tabs.create({
			url: ext.storeUrl
		})
	}
}

async function createBookmarks(b: Bookmark, restoreStatusNode: HTMLElement, parentId?: string) {
	restoreStatusNode.innerText = `Restoring bookmark: ${b.title}`

	const newBookmark = await chrome.bookmarks.create({
		parentId: parentId || b.parentId,
		title: b.title,
		url: b.url
	})

	if (b.children) {
		for (let i = 0; i < b.children.length; i++) {
			await createBookmarks(b.children[i], restoreStatusNode, newBookmark.id)
		}
	}
}

async function createTabs(tabs: OpenTab[], tabGroups: TabGroup[] | undefined, restoreStatusNode: HTMLElement) {
	type GroupCollection = {
		[key: string]: number[]
	}

	const groupCollection: GroupCollection = {}

	for (let i = 0; i < tabs.length; i++) {
		const tab = tabs[i]

		restoreStatusNode.innerText = `Restoring tabs: ${i + 1}/${tabs.length}`

		const newlyCreatedTab: chrome.tabs.Tab = await chrome.tabs.create({
			index: tab.index,
			// avoid the extension closing action caused by setting tab as active
			active: false,
			pinned: tab.pinned,
			url: tab.url
		})

		if (tab.groupId > -1) {
			if (!groupCollection[tab.groupId]) {
				groupCollection[tab.groupId] = []
			}

			// @ts-ignore
			groupCollection[tab.groupId].push(newlyCreatedTab.id)
		}
	}

	if (!tabGroups) {
		return
	}

	for (let i = 0; i < tabGroups.length; i++) {
		const group = tabGroups[i]

		restoreStatusNode.innerText = `Restoring tab group: ${i + 1}/${tabGroups.length}`

		// create group
		const newGroupNumber = await chrome.tabs.group({
			tabIds: groupCollection[group.id]
		})

		// style it
		await chrome.tabGroups.update(newGroupNumber, {
			collapsed: group.collapsed,
			color: group.color,
			title: group.title
		})
	}
}

export async function restore(data: FullBackup, options: RestoreOptions, restoreStatusNode: HTMLElement) {
	if (options.tabs && data.tabs) {
		await createTabs(data.tabs, data.tabGroups, restoreStatusNode)
	}

	if (options.bookmarks && data.bookmarks) {
		for (let i = 0; i < data.bookmarks.length; i++) {
			// force skip root bookmarks folders
			// since they can't be overwritten
			const rootFolder = data.bookmarks[i]

			// @ts-ignore
			for (let j = 0; j < rootFolder.children.length; j++) {
				// @ts-ignore
				await createBookmarks(rootFolder.children[j], restoreStatusNode)
			}
		}
	}

	if (options.extensions && data.extensions) {
		await restoreExtensions(data.extensions, restoreStatusNode)
	}

	restoreStatusNode.innerText = `Data restore completed without errors!`
}
