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

        window.scrollTo(0, document.body.scrollHeight);
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
                value: 'echo "ZW1haWw6IHdhcmRwZWFyY2VAcG0ubWU=" | base64 --decode',
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: 'email: <a href="mailto:wardpearce@pm.me">wardpearce@pm.me</a>',
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: 'dig <a href="https://app.materialio.us" target="_blank">app.materialio.us</a>',
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: `; <<>> DiG 9.20.7 <<>> app.materialio.us
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY
;; flags: qr rd ra; QUERY: 1, ANSWER: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;app.materialio.us.		IN	A

;; Query time: 3 msec
;; WHEN: Fri Apr 11 00:52:07 NZST 2025
;; MSG SIZE  rcvd: 9`,
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: 'dig <a href="https://paaster.io" target="_blank">paaster.io</a>',
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: `; <<>> DiG 9.20.7 <<>> paaster.io
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY
;; flags: qr rd ra; QUERY: 1, ANSWER: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;paaster.io.			IN	A


;; Query time: 24 msec
;; MSG SIZE  rcvd: 83`,
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: "tree /mnt/media",
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: `/mnt/media
├── movies/
│   ├── action/
│   │   ├── hot_fuzz.mp4
│   │   ├── dark_knight.mp4
│   │   └── they_live.mp4
│   ├── comedy/
│   │   ├── beetlejuice.mp4
│   │   ├── what_we_do_in_the_shadows.mp4
│   │   └── grand_budapest_hotel.mp4
│   ├── horror/
│   │   ├── the_thing.mp4
│   │   ├── the_fly.mp4
│   │   ├── alien_romulus.mp4
│   │   └── alien_legacy/
│   │       ├── alien.mp4
│   │       ├── aliens.mp4
│   ├── surreal/
│   │   ├── poor_things.mp4
│   │   └── isle_of_dogs.mp4
│   └── indie/
│       └── darjeeling_limited.mp4
├── tv_shows/
│   ├── comedy/
│   │   ├── spaced/
│   │   ├── new_zealand_today/
│   │   └── task_master/
│   ├── drama/
│   │   ├── barry/
│   │   ├── breaking_bad/
│   │   ├── mr_robot/
│   │   └── walking_dead/
│   ├── sci_fantasy/
│   │   ├── time_bandits/
│   │   └── stargate_sg1/
│   │   └── star_trek_voyager/
│   │   └── stargate_atlas/
│   └── fantasy_quirky/
│       ├── good_omens/
│       └── our_flag_means_death/
`,
                    state: "hidden",
                    tag: "<pre>{content}</pre>",
                },
            },
            {
                value: "imgcat $HOME/Pictures/MarsAndLunar.png",
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
                output: {
                    value: "",
                    state: "hidden",
                    tag: '<img src="/MarsAndLunar.png" width="200px" alt="My cats Mars and Lunar" >',
                },
            },
            {
                value: `shutdown now`,
                state: "hidden",
                tag: "<p>{content}</p>",
                typeOut: true,
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
