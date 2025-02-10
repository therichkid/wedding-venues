<script lang="ts">
	import mql, { type MqlResponseData } from '@microlink/mql';

	let url = $state('');
	let preview = $state<MqlResponseData | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

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
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			preview = null;
		} finally {
			loading = false;
		}
	}
</script>

<div class="m-3 flex flex-col gap-3">
	<div class="flex flex-col gap-2">
		<label class="label">
			<span class="label-text">URL</span>
			<input type="url" bind:value={url} placeholder="Enter URL to preview" class="input" />
		</label>

		<button
			type="button"
			onclick={fetchPreview}
			disabled={loading}
			class="btn preset-filled-primary-500">{loading ? 'Loading...' : 'Get Preview'}</button
		>
	</div>

	{#if error}
		<div class="rounded-md border-[1px] border-error-500 p-2 text-error-500">
			{error}
		</div>
	{/if}

	{#if preview}
		<div
			class="card block divide-y overflow-hidden border-[1px] border-surface-200-800 divide-surface-200-800 preset-filled-surface-100-900"
		>
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
			</article>
			<footer class="flex items-center justify-between gap-3 p-3">
				<small class="opacity-60">{preview.publisher ?? ''}</small>
				<small class="opacity-60">
					<a href={preview.url} target="_blank" rel="noopener noreferrer">Visit Site</a>
				</small>
			</footer>
		</div>
	{/if}
</div>
