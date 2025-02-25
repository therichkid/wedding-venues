<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { parseLatLng } from '$lib/helpers/lat-lng';
	import mql, { type MqlResponseData } from '@microlink/mql';
	import type { SubmitFunction } from '@sveltejs/kit';

	let url = $state('');
	let mapsUrl = $state('');

	let preview = $state<MqlResponseData | null>(null);
	let latLng = $state<{ lat: string; lng: string } | null>(null);

	let loading = $state(false);
	let error = $state<string | null>(null);

	let isFormValid = $derived(Boolean(preview?.url && preview?.title && latLng?.lat && latLng?.lng && !error));

	$effect(() => {
		if (mapsUrl) {
			try {
				const { latitude, longitude } = parseLatLng(mapsUrl);

				latLng = { lat: latitude.toString(), lng: longitude.toString() };
				error = null;
			} catch (err) {
				latLng = null;
				error = err instanceof Error ? err.message : 'Invalid maps URL';
			}
		} else {
			latLng = null;
		}
	});

	const fetchPreview = async () => {
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

			console.log('Fetched preview:', data);
			preview = data;
			error = null;
		} catch (err) {
			preview = null;
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	};

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				url = '';
				mapsUrl = '';
				preview = null;
				latLng = null;

				closeModal();
				await invalidateAll();
			} else if (result.type === 'failure') {
				error = result.data?.error || 'Failed to add venue';
			}
		};
	};

	const openModal = (event: MouseEvent) => {
		event.stopPropagation();

		const modal = getModalElement();
		if (!modal) return;

		modal.showModal();
		modal.addEventListener('click', closeOnBackdropClick);
	};

	const closeModal = (event?: MouseEvent) => {
		event?.stopPropagation();

		const modal = getModalElement();
		if (!modal) return;

		modal.close();
		modal.removeEventListener('click', closeOnBackdropClick);
	};

	const closeOnBackdropClick = (event: MouseEvent) => {
		const dialog = getModalElement();

		if (!dialog) return;

		const rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			closeModal();
		}
	};

	const getModalElement = () => {
		const elemModal: HTMLDialogElement | null = document.querySelector('[data-dialog]');
		return elemModal;
	};
</script>

<button data-dialog-show onclick={openModal} class="btn preset-filled-primary-500 w-full">Add Venue</button>

<dialog
	data-dialog
	class="card bg-surface-100-900 backdrop:bg-surface-50/75 dark:backdrop:bg-surface-950/75 fixed top-1/2 left-1/2 z-10 h-full max-h-3/4 w-full max-w-screen-md -translate-x-1/2 -translate-y-1/2 space-y-4 p-4 shadow-xl"
>
	<form method="post" action="?/addVenue" use:enhance={handleSubmit} class="flex h-full flex-col">
		<header>
			<h2 class="h2 mb-4">Add Venue</h2>
		</header>

		<article class="flex grow flex-col gap-4">
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<div class="ig-cell preset-tonal">https://</div>
				<input type="url" bind:value={url} class="ig-input" placeholder="www.matrimonio.com" />
				<button type="button" onclick={fetchPreview} disabled={loading} class="ig-btn preset-filled">
					{loading ? 'Loading...' : 'Load'}
				</button>
			</div>

			{#if error}
				<div class="border-error-500 rounded-lg border-[1px] p-4">
					{error}
				</div>
			{/if}

			{#if preview}
				<div class="border-surface-200-800 flex flex-col rounded-lg border-[1px]">
					{#if preview.image}
						<img src={preview.image.url} alt={preview.title} class="aspect-[21/9] w-full rounded-t-lg object-cover" />
					{/if}
					<div class="p-3">
						<h3 class="h3">{preview.title}</h3>
						{#if preview.description}
							<p class="mt-1 opacity-60">{preview.description}</p>
						{/if}
					</div>
				</div>

				<label class="label">
					<span class="label-text">Google Maps</span>
					<div class="input-group grid-cols-[auto_1fr]">
						<div class="ig-cell preset-tonal">https://</div>
						<input type="url" bind:value={mapsUrl} class="ig-input" placeholder="maps.google.com" />
					</div>
				</label>
			{/if}
		</article>

		<!-- Hidden inputs for form submission -->
		<input type="hidden" name="url" value={preview?.url} />
		<input type="hidden" name="name" value={preview?.title} />
		<input type="hidden" name="description" value={preview?.description} />
		<input type="hidden" name="imageUrl" value={preview?.image?.url} />
		<input type="hidden" name="lat" value={latLng?.lat} />
		<input type="hidden" name="lng" value={latLng?.lng} />

		<footer class="flex justify-end gap-4">
			<button type="reset" data-dialog-close onclick={closeModal} class="btn preset-tonal">Cancel</button>
			<button type="submit" disabled={!isFormValid} class="btn preset-filled-primary-500">Add Venue</button>
		</footer>
	</form>
</dialog>
