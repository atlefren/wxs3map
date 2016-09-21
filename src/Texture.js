import {
    TextureLoader,
    LinearFilter
} from 'three';

import createQueryString from './util/createQueryString';

function Texture(textureConfig, dim) {

    function _getImageMap() {
    var imageCall;
    if (textureConfig.imgUrl) { //IMAGE
        return textureConfig.imgUrl;
    }
    var params = {
        service: 'wms',
        version: '1.3.0',
        request: 'getMap',
        crs: dim.crs,
        WIDTH: dim.imgWidth,
        HEIGHT: dim.imgHeight,
        bbox: dim.envelope.join(','),
        layers: textureConfig.wmsLayers,
        format: textureConfig.wmsFormat + textureConfig.wmsFormatMode
    };
    return textureConfig.wmsUrl + '?' + createQueryString(params);
};

    function loadTexture(callback) {

        var loader = new TextureLoader(),
            image = _getImageMap();
            //_this = this;
        //var events = this.events;
        // load a resource
        loader.load(
            image,
            function (texture) {
                //Texture is probably not the power of two.
                //Avoid warning: Apply THREE.LinearFilter or THREE.NearestFilter
                texture.minFilter = LinearFilter;
                callback(texture);
                /*
                //Set texture in material which needs updating
                material.map = texture;
                material.needsUpdate = true;
                */
            },
            // Function called when download progresses
            function (xhr) {
                if (xhr.loaded === xhr.total) {
                    //events.fire('onTextureLoadEnd');
                }
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened on texture load: ' + image);
            }
        );
    };
    return {
        loadTexture: loadTexture
    };
}

export default Texture;