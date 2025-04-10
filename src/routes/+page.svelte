<script lang="ts">
    import type { Step } from "$lib/models";
    import Steps from "$lib/Steps.svelte";
    import { onDestroy, onMount } from "svelte";

    let steps: Step[] = $state([]);
    let currentStep = 0;
    let showingOutput = false;

    let automaticStepsInterval: number | undefined;

    let isMobile = false;

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
        if (document.documentElement.clientWidth <= 1200) {
            isMobile = true;
        }

        const welcomeFile = `outputs/${isMobile ? "mobile/" : ""}welcome.txt`;
        const projectsFile = `outputs/${isMobile ? "mobile/" : ""}projects.txt`;

        steps = [
            {
                value: `curl ${document.location.href}${welcomeFile}`,
                state: "current",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: await (await fetch(`/${welcomeFile}`)).text(),
                    state: "hidden",
                    tag: '<pre class="ascii">{content}</pre>',
                },
            },
            {
                value: `curl ${document.location.href}${projectsFile}`,
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: await (await fetch(`/${projectsFile}`)).text(),
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: 'echo "Y29udGFjdCBtZTogd2FyZHBlYXJjZUBwbS5tZQ==" | base64 --decode',
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: '<a href="mailto:wardpearce@pm.me">contact me: wardpearce@pm.me</a>',
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: `sudo mkfs.ext4 /dev/sda1`,
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

        automaticStepsInterval = setInterval(nextStep, 2300);
    });

    onDestroy(() => {
        clearInterval(automaticStepsInterval);
    });
</script>

{#each steps as step}
    <Steps {step} />
{/each}
