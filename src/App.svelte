<script>
    // @ts-nocheck
	import { dialog, letterToPixel } from "./util.js";
	
    const params = new URLSearchParams(window.location.search);

    const MINSIZE = 1,
        MAXSIZE = 300,
        MINCOLORID = 0,
		MAXCOLORID = letterToPixel.max,
        CW = 300,
        CH = CW,
        DEFAULTSIZE = 11,
        DEFAULTCOLORID = 3;

    const [canvas, ctx, canvas2, ctx2, canvas3, ctx3] = Array.from({ length: 3 }, () => document.createElement("canvas")).flatMap((c) => [c, c.getContext("2d")]);
    canvas3.width = canvas2.width = canvas.width = CW;
    canvas3.height = canvas2.height = canvas.height = CH;

    let bgSrc;
    let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz .";
    let imgSrc =
        "data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7";
    let pixelart = params.get("pixelart") !== null;
    let size = +params.get("size") || DEFAULTSIZE;
    let colorid = params.get("v") || DEFAULTCOLORID;

    $: (ctx2.imageSmoothingEnabled = !pixelart);
    $: {
        if (colorid > MAXCOLORID) colorid = MAXCOLORID;
        else if (colorid < MINCOLORID) colorid = MINCOLORID;
    }
    $: {
        if (size > MAXSIZE) size = MAXSIZE;
        else if (size < MINSIZE) size = MINSIZE;
    }
    $: text, size, colorid, pixelart, draw();

    function copyLink() {
        const linkParams = new URLSearchParams();
        if (pixelart) linkParams.append("pixelart", "");
        if (size !== DEFAULTSIZE) linkParams.append("size", size);
        if (colorid !== DEFAULTCOLORID) linkParams.append("v", colorid);
        linkParams.append("text", text);
        const url = window.location.origin + "?" + linkParams;
        navigator.clipboard.writeText(url);
        dialog("Link copied to clipboard", 3);
    }

    function draw() {
		console.log("draw");
        let data = Array.from(text).filter((c) => c !== "\n");
        if (!data.length) return;

        ctx.clearRect(0, 0, CW, CH);
        ctx2.clearRect(0, 0, CW, CH);

        let w = size;
        const charsNeeded = w * w;

        let arr = data.map((s) => s.charCodeAt(0));

        const multiply = Math.ceil(charsNeeded / arr.length);
        arr = Array.from({ length: multiply }, () => arr).flat();

        arr = arr.flatMap((s) => letterToPixel[colorid](s));

        const pixNeededToFitWidth = w - ((arr.length / 4) % w);
        arr = arr.concat(new Array(pixNeededToFitWidth * 4).fill(0));

        ctx.putImageData(new ImageData(new Uint8ClampedArray(arr), w), 0, 0);
        if (!pixelart)
            // second pass so borders don't fade
            ctx2.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size));
        ctx2.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size));
        ctx3.drawImage(canvas, 0, 0, CW, CH, 0, 0, CW * (CW / size), CW * (CW / size));
        ctx3.globalAlpha = 0.1;
        imgSrc = canvas2.toDataURL();
        bgSrc = canvas3.toDataURL();
    }
</script>

<main>
    <img id="bg" src={bgSrc} />
    <div id="container">
        <div id="inputs">
            <textarea bind:value={text} id="text" />
            <div id="bottomrow">
                <input bind:checked={pixelart} id="pixelartbox" type="checkbox" />
                <input bind:value={size} id="scale" min={MINSIZE} max={MAXSIZE} type="number" />
                <input bind:value={colorid} id="color" min={MINCOLORID} type="number" />
                <button on:click={copyLink} id="copy">copy</button>
            </div>
        </div>
        <img src={imgSrc} id="image" />
    </div>
</main>

<style>
</style>
