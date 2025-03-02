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
				<img src={venue.imageUrl} alt={venue.name} />
				<p>{venue.description}...</p>
				<p>
					{#if venue.url}
						<a href={venue.url} target="_blank" class="text-primary-500 font-medium hover:underline">Visit Website.</a>
					{/if}
				</p>
			{/snippet}
		</Accordion.Item>
	{/each}
</Accordion>
