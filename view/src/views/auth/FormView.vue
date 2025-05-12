<template>
    <div class="form">
        <div class="form-title"><span>TOSHI</span></div>
        <div class="title-2"><span>都市通讯</span></div>
        <div class="form_list">
            <transition-group appear name="animate__animated animate_bounce" enter-active-class="vanishIn"
                leave-active-class="leave_hidden">
                <div name="1" class="login_form" v-if="formType == 'login'">
                    <div class="input-container">
                        <input v-model="loginForm.account" placeholder="账号" type="email" class="input-mail" />
                        <span> </span>
                    </div>
                    <div class="input-container">
                        <input v-model="loginForm.password" placeholder="密码" type="password" class="input-pwd" />
                    </div>
                    <button @click="loginCallback" :disabled="loginDisabled" class="submit" type="submit">
                        <span class="sign-text">{{ loginDisabled ? '登录中' : '登录' }}</span>
                    </button>

                    <p class="signup-link">
                        新用户?
                        <a class="up" @click="formType = 'register'">注册!</a>
                    </p>
                </div>
                <div name="2" class="register_form" v-else="formType=='register'">
                    <div class="input-container">
                        <input v-model="registerForm.account" placeholder="注册账号" type="email" class="input-mail" />
                        <span> </span>
                    </div>

                    <div class="input-container">
                        <input v-model="registerForm.password" placeholder="密码" type="password" class="input-pwd" />
                    </div>
                    <div class="input-container">
                        <input v-model="registerForm.re_password" placeholder="重复密码" type="password" class="input-pwd" />
                    </div>
                    <button @click="registerCallback" :disabled="registerDisabled" class="submit" type="submit">
                        <span class="sign-text">{{ registerDisabled ? '注册中' : '注册' }}</span>
                    </button>

                    <p class="signup-link">
                        已有账号?
                        <a class="up" @click="formType = 'login'">登录!</a>
                    </p>
                </div>
            </transition-group>
        </div>
        <section class="bg-stars">
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
        </section>


    </div>
</template>

<script setup>
import { ref } from 'vue';
import useUserStore from '@/stores/user';
import { reactive,toRaw } from 'vue';
import Message from '@/utils/customMessage.js'
import { useRouter } from 'vue-router';
const userSotre = useUserStore();
const router = useRouter();
const formType = ref('login');
const loginDisabled =  ref(false);
const registerDisabled =  ref(false);
const loginForm = reactive({
    account: '',
    password: ''
})
const registerForm = reactive({
    account: '',
    password: '',
    re_password: ''
})
const loginCallback = () => {
    if(!loginForm.account.trim() || !loginForm.password.trim()) return Message({
        type:'error',
        value:'请填写完登录表单！',
        duration:1500,
    })
    loginDisabled.value = true;
    userSotre.userLogin({ ...toRaw(loginForm) })
    .then(data => {
        Message({
            type:'normal',
            value:'登录成功',
            duration:2400,
        })
        router.replace('./layout');
    })
    .catch(data => {
        Message({
            type:'error',
            value:data.msg,
            duration:2400,
        })
    })
    .finally(() => loginDisabled.value = false)
}
const registerCallback = () => {
    if(!registerForm.password.trim() || !registerForm.account.trim()) return Message({
        type:'error',
        value:'请填写完注册表单！',
        duration:1500,
    })
    if (registerForm.password != registerForm.re_password)  return Message({
        type:'error',
        value:'两次重复密码不一致！',
        duration:1500,
    })
    registerDisabled.value = true;
    userSotre.userRegister({ ...toRaw(registerForm) })
    .then(data => {
        Message({
            type:'normal',
            value:'注册成功',
            duration:2400,
        })
        router.replace('./layout');
    })
    .catch(msg => {
        Message({
            type:'error',
            value:data.msg,
            duration:2400,
        })
    })
    .finally(() => registerDisabled.value = false)
}
</script>

<style lang="scss" scoped>
.form {
    position: relative;
    padding: 2.2rem;
    max-width: 350px;
    background: linear-gradient(14deg,
            rgba(2, 0, 36, 0.8) 0%,
            rgba(24, 24, 65, 0.7) 66%,
            rgb(20, 76, 99) 100%),
        radial-gradient(circle,
            rgba(2, 0, 36, 0.5) 0%,
            rgba(32, 15, 53, 0.2) 65%,
            rgba(14, 29, 28, 0.9) 100%);
    border: 2px solid var(--white);
    -webkit-box-shadow: var(--blue) 0px 0px 50px -15px;
    box-shadow: var(--blue) 0px 0px 50px -15px;
    overflow: hidden;
    z-index: +1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 385px;

}

/*------input and submit section-------*/
.form_list {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

.input-container {
    position: relative;
}

.input-container input,
.form button {
    outline: none;
    border: 2px solid var(--white);
    margin: 8px 0;
    border-radius: 4px;
}

.input-container input {
    background-color: #00000047;
    color: white;
    padding: 6px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 250px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

    &::placeholder {
        color: #aaa;
    }
}

.input-mail:focus::placeholder {
    opacity: 0;
    transition: opacity 0.9s;
}

.input-pwd:focus::placeholder {
    opacity: 0;
    transition: opacity 0.9s;
}

.submit {
    position: relative;
    display: block;
    padding: 8px;
    background: linear-gradient(90deg, #243949 0%, #517fa4 100%);
    color: var(--white);
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: 100%;
    text-transform: uppercase;
    overflow: hidden;
    &[disabled]{
        background: linear-gradient(90deg, #868686 0%, #8f8f8f 100%);
        border-color: transparent;
        box-shadow: inset 0 0 8px #5c5454;
    }
}

.submit:not([disabled]):hover {
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
    box-shadow: 4px 5px 17px -4px var(--white);
    cursor: pointer;
}

.submit:hover::before {
    -webkit-animation: sh02 0.5s 0s linear;
    -moz-animation: sh02 0.5s 0s linear;
    animation: sh02 0.5s 0s linear;
}

.submit::before {
    content: "";
    display: block;
    width: 0px;
    height: 85%;
    position: absolute;
    top: 50%;
    left: 0%;
    opacity: 0;
    background: var(--white);
    box-shadow: 0 0 50px 30px var(--white);
    -webkit-transform: skewX(-20deg);
    -moz-transform: skewX(-20deg);
    -ms-transform: skewX(-20deg);
    -o-transform: skewX(-20deg);
    transform: skewX(-20deg);
}

@keyframes sh02 {
    from {
        opacity: 0;
        left: 0%;
    }

    50% {
        opacity: 1;
    }

    to {
        opacity: 0;
        left: 100%;
    }
}

/*--------signup section---------*/

.signup-link {
    color: #c0c0c0;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
}

.signup-link a {
    color: var(--white);
    text-decoration: none;
}

.up:hover {
    text-decoration: underline;
}

/*--------header section-----------*/

.form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: var(--white);
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
    animation-duration: 1.5s;
    overflow: hidden;
    transition: 0.12s;
}

.form-title span {
    animation: flickering 2s linear infinite both;
}

.title-2 {
    display: block;
    margin-top: -0.5rem;
    font-size: 2.1rem;
    font-weight: 800;
    text-align: center;
    -webkit-text-stroke: var(--white) 0.1rem;
    letter-spacing: 0.2rem;
    color: transparent;
    position: relative;
    text-shadow: 0px 0px 16px #cecece;
}

.title-2 span::before,
.title-2 span::after {
    content: "—";
}

@keyframes flickering {

    0%,
    100% {
        opacity: 1;
    }

    41.99% {
        opacity: 1;
    }

    42% {
        opacity: 0;
    }

    43% {
        opacity: 0;
    }

    43.01% {
        opacity: 1;
    }

    47.99% {
        opacity: 1;
    }

    48% {
        opacity: 0;
    }

    49% {
        opacity: 0;
    }

    49.01% {
        opacity: 1;
    }
}


/*---------shooting stars-----------*/

.bg-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-size: cover;
    animation: animateBg 50s linear infinite;
}

@keyframes animateBg {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }
}

.star {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: var(--white);
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
        0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.1);
    animation: animate 3s linear infinite;
}

.star::before {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, var(--white), transparent);
}

@keyframes animate {
    0% {
        transform: rotate(315deg) translateX(0);
        opacity: 1;
    }

    70% {
        opacity: 1;
    }

    100% {
        transform: rotate(315deg) translateX(-1000px);
        opacity: 0;
    }
}

.star:nth-child(1) {
    top: 0;
    right: 0;
    left: initial;
    animation-delay: 0s;
    animation-duration: 1s;
}

.star:nth-child(2) {
    top: 0;
    right: 100px;
    left: initial;
    animation-delay: 0.2s;
    animation-duration: 3s;
}

.star:nth-child(3) {
    top: 0;
    right: 220px;
    left: initial;
    animation-delay: 2.75s;
    animation-duration: 2.75s;
}

.star:nth-child(4) {
    top: 0;
    right: -220px;
    left: initial;
    animation-delay: 1.6s;
    animation-duration: 1.6s;
}
</style>