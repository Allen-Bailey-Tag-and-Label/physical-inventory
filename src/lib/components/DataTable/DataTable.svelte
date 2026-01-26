<script lang="ts">
	import {
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Button, Card, Div, Table, Tbody, Th, Thead, Tr } from '$lib/components';
	import { theme } from '$lib/theme';
	import { grow } from '$lib/transitions';

	// types
	type CellSnippet = Snippet<
		[
			{
				columnIndex: number;
				row: Record<string, any>;
				rowIndex: number;
				valueFn: (row: Record<string, any>) => any;
			}
		]
	>;
	type Props = {
		columns?: {
			label: string;
			snippet: CellSnippet;
			sortFn: (a: any, b: any) => number;
			valueFn: (row: Record<string, any>) => any;
		}[];
		data?: Record<string, any>[];
		isExportable?: boolean;
		pagination?: {
			currentPage?: number;
			rows?: number;
		};
		sortColumnIndex?: number;
		sortDirection?: -1 | 1;
	};

	// helpers
	const exportToCSV = () => {
		const csvEscape = (value: any) => {
			if (value === null || value === undefined) return '';

			const str = String(value);

			// Escape quotes by doubling them
			const escaped = str.replace(/"/g, '""');

			// Wrap in quotes if it contains special characters
			if (/[",\n]/.test(escaped)) {
				return `"${escaped}"`;
			}

			return escaped;
		};
		const headerContent = columns.map(({ label }) => label).join(',');
		const dataContent = data.map((row) =>
			columns.map(({ valueFn }) => csvEscape(valueFn(row))).join(',')
		);

		const csvContent = [headerContent, ...dataContent].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = `export${new Date().getTime()}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(url);
	};

	// $props()
	let {
		columns = $bindable([]),
		data = $bindable([]),
		isExportable = $bindable(true),
		pagination = $bindable({ currentPage: 0, rows: 10 }),
		sortColumnIndex = $bindable(0),
		sortDirection = $bindable(1)
	}: Props = $props();

	// $effects
	$effect(() => {
		if (pagination.currentPage === undefined) pagination.currentPage = 0;
		if (pagination.rows === undefined) pagination.rows = 10;
	});

	// $derives
	const rowStartIndex = $derived.by(() => {
		if (pagination.currentPage === undefined) return 0;
		if (pagination.rows === undefined) return 0;

		return pagination.currentPage * pagination.rows;
	});
	const rowEndIndex = $derived.by(() => {
		if (pagination.currentPage === undefined) return 10;
		if (pagination.rows === undefined) return 10;

		return (pagination.currentPage + 1) * pagination.rows;
	});
</script>

<Card class="mr-auto flex max-w-full flex-col overflow-auto p-0">
	{#if isExportable}
		<Div class="flex items-center justify-end px-6 py-3">
			<Button onclick={exportToCSV}>Export</Button>
		</Div>
	{/if}
	<Div class="relative overflow-auto">
		<Table>
			<Thead>
				<Tr>
					{#each columns as { label }, columnIndex}
						<Th
							class={twMerge(
								'sticky top-0 p-0 whitespace-nowrap',
								columnIndex === 0 ? 'left-0 z-10' : undefined
							)}
						>
							<Button
								class={twMerge(
									theme.getComponentVariant('Th', 'default'),
									'flex w-full justify-between space-x-4 rounded-none hover:bg-primary-500/10 focus:bg-primary-500/10'
								)}
								onclick={() => {
									if (sortColumnIndex === columnIndex) sortDirection *= -1;
									if (sortColumnIndex !== columnIndex) {
										sortColumnIndex = columnIndex;
										sortDirection = 1;
									}
								}}
							>
								<Div>
									{label}
								</Div>
								<Div class="w-6">
									{#if columnIndex === sortColumnIndex}
										<Div transition={(element) => grow(element, { opacity: 1, scale: 0 })}>
											<ChevronDown
												class={twMerge(
													'transition duration-200',
													sortDirection === -1 ? 'rotate-180' : 'rotate-0'
												)}
											/>
										</Div>
									{/if}
								</Div>
							</Button>
						</Th>
					{/each}
				</Tr>
			</Thead>
			<Tbody>
				{#each [...data].sort((a, b) => columns[sortColumnIndex].sortFn(a, b) * sortDirection) as row, rowIndex}
					{#if rowIndex >= rowStartIndex && rowIndex < rowEndIndex}
						<Tr>
							{#each columns as { snippet, valueFn }, columnIndex}
								{@render snippet({ columnIndex, row, rowIndex, valueFn })}
							{/each}
						</Tr>
					{/if}
				{/each}
			</Tbody>
		</Table>
	</Div>
	<Div class="flex items-center justify-center space-x-4 px-6 py-3">
		<Button onclick={() => (pagination.currentPage = 0)} variants={['icon']}>
			<ChevronsLeft />
		</Button>
		<Button
			onclick={() => {
				pagination.currentPage = (pagination.currentPage ?? 1) - 1;
			}}
			variants={['icon']}
		>
			<ChevronLeft />
		</Button>
		<Button
			onclick={() => {
				pagination.currentPage = (pagination.currentPage ?? -1) + 1;
			}}
			variants={['icon']}
		>
			<ChevronRight />
		</Button>
		<Button
			onclick={() => {
				pagination.currentPage = Math.ceil(data.length / (pagination.rows ?? 10)) - 1;
			}}
			variants={['icon']}
		>
			<ChevronsRight />
		</Button>
	</Div>
</Card>
