<script lang="ts">
	import type { Venue } from '$lib/types/db';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	let { venues = [], activeVenueId = $bindable() }: { venues: Venue[]; activeVenueId?: number } = $props();

	let value = $state<string[]>([]);

	$effect(() => {
		value = activeVenueId ? [String(activeVenueId)] : [];
	});

	$effect(() => {
		activeVenueId = value.length > 0 ? Number(value[0]) : undefined;
	});
</script>

<Accordion {value} onValueChange={(e) => (value = e.value)} collapsible>
	{#each venues as venue, i (venue.id)}
		{#if i > 0}
			<hr class="hr" />
		{/if}
		<Accordion.Item value={venue.id.toString()}>
			{#snippet control()}<h2>{venue.name}</h2>{/snippet}
			{#snippet panel()}
				<div class="flex flex-col gap-3">
					{#if venue.imageUrl}
						<img src={venue.imageUrl} alt={venue.name} class="aspect-[21/9] w-full rounded-t-lg object-cover" />
					{/if}

					{#if venue.description}
						<p>{venue.description}...</p>
					{/if}

					{#if venue.url}
						<a href={venue.url} target="_blank" class="text-primary-500 font-medium hover:underline">Visit Website</a>
					{/if}
				</div>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>
