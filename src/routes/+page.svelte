<script lang="ts">
    import type { Step } from "$lib/models";
    import Steps from "$lib/Steps.svelte";
    import { onDestroy, onMount } from "svelte";

    let steps: Step[] = $state([]);
    let currentStep = 0;
    let showingOutput = false;

    let automaticStepsInterval: number | undefined;

    function nextStep() {
        if (currentStep >= steps.length) {
            clearInterval(automaticStepsInterval);
            return;
        }

        const step = steps[currentStep];

        if (!showingOutput && step.output) {
            step.state = "past";
            step.output.state = "current";
            showingOutput = true;
        } else {
            if (step.output) {
                step.output.state = "past";
            }
            currentStep++;
            if (currentStep < steps.length) {
                steps[currentStep].state = "current";
            }
            showingOutput = false;
        }
    }

    onMount(async () => {
        steps = [
            {
                value: `curl ${document.location.href}outputs/welcome.txt`,
                state: "current",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: await (await fetch("/outputs/welcome.txt")).text(),
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: `curl ${document.location.href}outputs/projects.txt`,
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: await (await fetch("/outputs/projects.txt")).text(),
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: `echo "Give command to delete tmp files" | openai complete - | xargs -I {} sudo sh -c '{}'`,
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
            },
            {
                value: "ll /",
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: "total 0",
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: "screw my life",
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: " screw: command not found",
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
        ];

        automaticStepsInterval = setInterval(nextStep, 2000);
    });

    onDestroy(() => {
        clearInterval(automaticStepsInterval);
    });
</script>

{#each steps as step}
    <Steps {step} />
{/each}
