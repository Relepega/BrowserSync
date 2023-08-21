/* eslint-disable @typescript-eslint/ban-ts-comment */
/// <reference types="chrome" />

import type { FullBackup, Bookmark, OpenTab, TabGroup, BrowserExtension } from '$lib/types/types'

async function createTabs(data: FullBackup, restoreStatusNode: HTMLElement) {
	if (!data.tabs) {
		return
	}

	type GroupCollection = {
		[key: string]: number[]
	}

	const groupCollection: GroupCollection = {}

	for (let i = 0; i < data.tabs.length; i++) {
		const tab = data.tabs[i]

		restoreStatusNode.innerText = `Restoring tabs: ${i + 1}/${data.tabs.length}`

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

	if (!data.tabGroups) {
		return
	}

	for (let i = 0; i < data.tabGroups.length; i++) {
		const group = data.tabGroups[i]

		restoreStatusNode.innerText = `Restoring tab group: ${i + 1}/${data.tabGroups.length}`

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

export async function restore(data: FullBackup, restoreStatusNode: HTMLElement) {
	await createTabs(data, restoreStatusNode)
	restoreStatusNode.innerText = `Data restore completed without errors!`
}
