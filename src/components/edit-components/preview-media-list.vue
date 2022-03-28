<template>
<div class="media-wrapper">
    <div
        v-for="item in media"
        :key="item"
        class="media"
    >
        <img
            class="media-pic"
            :src="`${item.picture}`"
            :alt="`${item.picture}`"
        >
        <div>
            <p><span style="font-weight: bold">title:</span> {{item.title}}</p>
            <p><span style="font-weight: bold">year:</span> {{item.year}}</p>
            <p>
                <span style="font-weight: bold">link:</span>
                <a 
                    v-if="item.mediaLink.link"
                    :href="`${item.mediaLink.link}`"
                    target="_blank"
                >
                &#10003;
                </a>
            </p>
            <p>
                <span style="font-weight: bold">affiliate:</span>
                {{item.mediaLink.affiliate ? '&#10003;' : '&#x2715;'}}
            </p>
            <p 
                v-if="item.mediaLink.affiliateSource"
            >
            <span style="font-weight: bold">affiliate source:</span>
            {{item.mediaLink.affiliateSource}}
            </p>
        
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        media: {
            type: Array,
            required: true
        },
    }
}
</script>

<style scoped>

.media-wrapper {
    display: flex;
    flex-wrap: wrap;
    max-width: 500px;
}

.media {
    border: 1px solid;
    margin: 5px;
    padding: 2px;
    max-width: 150px;
    overflow: hidden;
}

.media-pic {
    width: auto;
    height: 70px;
    padding-right: 2px;
}

a {
    color: black;
    text-decoration: none;
}
@media screen and (max-width: 550px) {
    .media-wrapper {
        display: flex;
        flex-direction: column;
    }
}

</style>