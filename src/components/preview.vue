<template>

<div
    class="container"
    v-for="(event, index) in $store.state.event"
    :key="event"
>
    <div class="event-details">
        <p>date: {{new Date($store.state.event[index].date).toLocaleDateString('en-us', {month:"long", day:"numeric", year: "numeric"})}}</p>
        title: <p>{{$store.state.event[index].title}}</p>
        <p>citation: 
            <a 
                v-if="$store.state.event[index].citation"
                :href="`${$store.state.event[index].citation}`"
                target="_blank"
            >
            link
            </a>
        </p>
        
        <div style="display: flex; align-items: center">
            <p>main picture:</p>
            <img
                :src="`${$store.state.event[index].mainPicture}`"
                :alt="`${$store.state.event[index].mainPicture}`"
                style="width: 100px;"
            >
        </div>
        
        <p>keywords: {{$store.state.event[index].keywords}}</p>
        <iframe
            class="map"
            v-if="$store.state.event[index].location.coordinates"
            style="border:0; width: 150px;"
            loading="lazy"
            allowfullscreen
            :src="`https://www.google.com/maps/embed/v1/view?key=AIzaSyAzuMuGU3ynDz4KU87IzdKY_pXzhUyILoQ&center=
            ${$store.state.event[index].location.coordinates}&zoom=${$store.state.event[index].location.mapZoom}
            &maptype=satellite`"
        />
    </div>
    <div class="media-container">
        <!-- BOOKS -->
        <p>books:</p>
        <div class="media-wrapper">
            
            <div
                v-for="book in $store.state.event[index].books"
                :key="book"
                class="book media"
            >
                <img class="media-pic" :src="`${book.picture}`" :alt="`${book.picture}`">
                <div>
                    <p>title: {{book.title}}</p>
                    <p>year: {{book.year}}</p>
                    <p>link: <a v-if="book.mediaLink.link" :href="`${book.mediaLink.link}`" target="_blank">link</a></p>
                    <p>affiliate: {{book.mediaLink.affiliate}}</p>
                    <p>affiliate source: {{book.mediaLink.affiliateSource}}</p>
                </div>
            </div>
        </div>
        <!-- MOVIES -->
        <p>movies:</p>
        <div class="media-wrapper">
            
            <div
                v-for="movie in $store.state.event[index].movies"
                :key="movie"
                class="movie media"
            >
                
                <img
                class="media-pic"
                :src="`${movie.picture}`"
                :alt="`${movie.picture}`">
                <div>
                    <p>title: {{movie.title}}</p>
                    <p>year: {{movie.year}}</p>
                    <p>link: <a v-if="movie.mediaLink.link" :href="`${movie.mediaLink.link}`" target="_blank">link</a></p>
                    <p>affiliate: {{movie.mediaLink.affiliate}}</p>
                    <p>affiliate source: {{movie.mediaLink.affiliateSource}}</p>
                </div>
            </div>
        </div>
    </div>


</div>


    
    

</template>

<script>
export default {

}
</script>

<style scoped>

.container {
    padding: 10px 25px;
    border: 1px solid;
    width: max-content;
    margin: 20px auto;
    display: flex;
}

.event-details {
    max-width: 300px;
    overflow: hidden;
}

.media-container {
    margin-left: 50px;
}

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

@media screen and (max-width: 550px ) {
    .container {
        flex-direction: column;
    }
    .media-container {
        margin-left: 0px;
    }
    .media {
        margin: 0 0 10px 0;
    }
}


</style>