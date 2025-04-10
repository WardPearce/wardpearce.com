<script lang="ts">
    import Steps from "$lib/Steps.svelte";
    import Typewriter from "svelte-typewriter";
    import type { Step } from "./models";

    let props: { step: Step } = $props();
</script>

{#if props.step.state !== "hidden"}
    {#if props.step.typeOut}
        <Typewriter cursor={true} interval={20}>
            {@html props.step.tag.replaceAll("{content}", props.step.value)}
        </Typewriter>
    {:else}
        {@html props.step.tag.replaceAll("{content}", props.step.value)}
    {/if}

    {#if props.step.output && props.step.output.state !== "hidden"}
        <Steps step={props.step.output} />
    {/if}
{/if}
