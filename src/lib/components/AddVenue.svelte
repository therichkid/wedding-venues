<script lang="ts">
	import { enhance } from '$app/forms';
	import { parseLatLng } from '$lib/helpers/lat-lng';
	import type { InsertVenue } from '$lib/types/db';
	import mql, { type MqlResponseData } from '@microlink/mql';

	let url = $state('');
	let mapsUrl = $state('');
	let preview = $state<MqlResponseData | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	let formData = $state<InsertVenue>({
		url: '',
		name: '',
		description: null,
		imageUrl: null,
		lat: null,
		lng: null,
	});

	let isFormValid = $derived(Boolean(preview?.url && preview?.title && formData.lat && formData.lng && !error));

	async function fetchPreview() {
		if (!url) {
			error = 'Please enter a URL';
			return;
		}

		loading = true;
		error = null;

		try {
			const { statusCode, data } = await mql(url, { data: {} });

			if (statusCode !== 200) {
				throw new Error('Failed to fetch preview');
			}

			preview = data;
			error = null;
		} catch (err) {
			preview = null;
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	$effect(() => {
		if (mapsUrl) {
			try {
				const { latitude, longitude } = parseLatLng(mapsUrl);

				formData.lat = latitude.toString();
				formData.lng = longitude.toString();
				error = null;
			} catch (err) {
				formData.lat = null;
				formData.lng = null;
				error = err instanceof Error ? err.message : 'Invalid maps URL';
			}
		}
	});
</script>

<div class="m-3 flex flex-col gap-3">
	<div class="flex flex-col gap-2">
		<label class="label">
			<span class="label-text">Add Venue</span>
			<input type="url" bind:value={url} placeholder="Enter Matrimonio URL" class="input" />
		</label>

		<button type="button" onclick={fetchPreview} disabled={loading} class="btn preset-filled-primary-500">
			{loading ? 'Loading...' : 'Preview'}
		</button>
	</div>

	{#if error}
		<div class="rounded-md border-[1px] border-error-500 p-2 text-error-500">
			{error}
		</div>
	{/if}

	{#if preview}
		<form
			method="post"
			action="?/addVenue"
			use:enhance
			class="card block divide-y overflow-hidden border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
		>
			<!-- Hidden inputs for form submission -->
			<input type="hidden" name="url" value={preview.url} />
			<input type="hidden" name="name" value={preview.title ?? ''} />
			<input type="hidden" name="description" value={preview.description ?? ''} />
			<input type="hidden" name="imageUrl" value={preview.image?.url ?? ''} />
			<input type="hidden" name="lat" value={formData.lat ?? ''} />
			<input type="hidden" name="lng" value={formData.lng ?? ''} />

			{#if preview.image}
				<header>
					<img src={preview.image.url} alt={preview.title} class="aspect-[21/9] w-full" />
				</header>
			{/if}

			<article class="space-y-3 p-3">
				<h2 class="h6">{preview.title}</h2>

				{#if preview.description}
					<p class="opacity-60">{preview.description}</p>
				{/if}

				<label class="label">
					<span class="label-text">Add Location</span>
					<input type="url" bind:value={mapsUrl} placeholder="Enter Google Maps Location" class="input" />
				</label>
			</article>
			<footer class="flex items-center justify-between gap-3 p-3">
				<button type="reset" class="btn preset-outlined-primary-500">Cancel</button>
				<button type="submit" disabled={!isFormValid} class="btn preset-filled-primary-500">Add Venue</button>
			</footer>
		</form>
	{/if}
</div>
