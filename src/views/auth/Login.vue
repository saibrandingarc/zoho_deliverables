<template>
    <div class="authentication">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4">
                                <Logo />
                            </div>
                            <div class="text-body-1 text-muted text-center mb-3">Change the deliverables easily</div>
                            <v-btn to="/" color="primary" size="large" block   flat @click="login">Login with Zoho</v-btn>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<script setup lang="ts">
import Logo from '@/layouts/full/logo/Logo.vue';
import { ref } from 'vue';
import axios from 'axios';
import authConfig from "../../../auth_config.json";
import { setZohoTokenWithExpiration } from '../../utils/tokenManager';

import { useRouter } from 'vue-router';

const router = useRouter();

const clientId = authConfig.clientId;
const clientSecret = authConfig.clientSecret;
const redirectUri = authConfig.redirectUri;
const scope = authConfig.scope;

const login = async () => {
    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?client_id=${clientId}&response_type=token&scope=${scope}&redirect_uri=${redirectUri}`;
    window.location.href = zohoAuthUrl;
};

const handleRedirect = async () => {
    const hash = window.location.hash.substring(1); // Remove the leading '#'
  
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const expiresIn = Number(params.get('expires_in'));
  
    if (accessToken) {
        try {
            console.log('Access Token:', accessToken);
            console.log('Expires In:', expiresIn);
            setZohoTokenWithExpiration(accessToken, expiresIn);
            localStorage.setItem('zoho_access_token', accessToken);
            router.push('/');
        } catch (error) {
            console.error('Error handling access token:', error);
        }
    } else {
        console.warn('No access token found in the URL');
    }
};

// Execute handleRedirect function when the component mounts
handleRedirect();

</script>