<template>
    <div class="load_view">
        <div class="animation">
            <div class="loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <div class="loader_text">
                    LOADING
                </div>
            </div>
        </div>
        <div class="line">
            <div class="progress">
                <div class="inner"></div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.load_view {
    position: absolute;
    z-index: 99999;
    width: 100%;
    height: 100%;
    top: 0px;
    background-color: rgb(238 237 238);
}

.animation {
    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --color: #000000;
        --size: 70px;
        width: var(--size);
        height: var(--size);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        filter:drop-shadow(2px 4px 39px #444);
    }
    .loader_text{
        position:absolute;
        bottom:0px;
        transform: translateY(100%)
    }
    .loader span {
        width: 100%;
        height: 100%;
        background-color: var(--color);
        animation: keyframes-blink 0.6s alternate infinite linear;
    }

    .loader span:nth-child(1) {
        animation-delay: 0ms;
    }

    .loader span:nth-child(2) {
        animation-delay: 200ms;
    }

    .loader span:nth-child(3) {
        animation-delay: 300ms;
    }

    .loader span:nth-child(4) {
        animation-delay: 400ms;
    }

    .loader span:nth-child(5) {
        animation-delay: 500ms;
    }

    .loader span:nth-child(6) {
        animation-delay: 600ms;
    }

    @keyframes keyframes-blink {
        0% {
            opacity: 0.3;
            transform: scale(0.5) rotate(5deg);
        }

        50% {
            opacity: 1;
            transform: scale(1);
        }
    }
}

.line {
    .progress {
        position:absolute;
        left:50%;
        bottom:50px;
        background-color: #ffffff;
        width: 40%;
        height: 20px;
        overflow: hidden;
        backface-visibility: hidden;
        transform: skew(150deg) translateX(-50%);
        box-shadow: 0 0 20px #999;
    }

    .inner {
        background-image: linear-gradient(to right bottom, #1f1f1f, #1f1f1f, #1f1f1f, #8d2d2d, #8d2d2d, #8d2d2d, #8d2d2d, #8d2d2d, #1f1f1f, #1f1f1f, #1f1f1f, #1f1f1f);
        height: 100%;
        transform-origin: left;
        transform: skew(-150deg);
        animation: progress 1.8s infinite;
    }

    @keyframes progress {
        0% {
            transform: scaleX(0%) translateX(-10%);
        }

        100% {
            transform: scaleX(90%) translateX(150%);
        }
    }

}
</style>