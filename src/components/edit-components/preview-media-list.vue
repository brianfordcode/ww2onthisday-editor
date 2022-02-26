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
            <p>title: {{item.title}}</p>
            <p>year: {{item.year}}</p>
            <p>link:
                <a 
                    v-if="item.mediaLink.link"
                    :href="`${item.mediaLink.link}`"
                    target="_blank"
                >
                &#10003;
                </a>
            </p>
            <p>affiliate: {{item.mediaLink.affiliate ? '&#10003;' : '&#x2715;'}}</p>
            <p v-if="item.mediaLink.affiliateSource">affiliate source: {{item.mediaLink.affiliateSource}}</p>
        
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

</style>