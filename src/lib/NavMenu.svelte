<script lang="ts">
</script>

<header class="bg-gray-800">
	<div class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8">
		<div class="relative flex h-16 justify-between">
			<div class="relative z-10 flex px-2 lg:px-0">
				<div class="flex flex-shrink-0 items-center">
					<div class="h-8 w-auto text-indigo-300">
						<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="h-8 inline-block" viewBox="0 0 16 16">
							<path
								d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div class="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
				<div class="w-full sm:max-w-xs">
					<label for="search" class="sr-only">Search</label>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									fill-rule="evenodd"
									d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
						<slot name="search-input" />
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
