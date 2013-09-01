function Texture() {
            this.texture = null;
            this.isLoaded = false;          // poll to check texture is ready for rendering.
            this.hasAlphaChannel = false;
}

// Statics
Object.defineProperties(Texture, {
    TexturesLoaded: {
        value: []
    },
    LoadTexture: {
        value: function LoadTexture(pathTexture) {
            var tex = new Texture(),
                img = new Image();

            img.onload = (function () {
                // Compat: Chrome fix.
                if (typeof this.nameProp === 'undefined')
                    this.nameProp = this.src.match(/.*\/(.*)/)[1];

                if (this.nameProp in Texture.TexturesLoaded) {
                    tex.texture = Texture.TexturesLoaded[this.nameProp];
                } else {
                    tex.texture = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, tex.texture);

                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

                    gl.generateMipmap(gl.TEXTURE_2D);
                    gl.bindTexture(gl.TEXTURE_2D, null);

                    Texture.TexturesLoaded[this.nameProp] = tex.texture;
                }
                tex.isLoaded = true;
            });

            img.src = pathTexture;

            return tex;
        }
    },
});

// Instance methods
Object.defineProperties(Texture.prototype, {
    bind: {
        value: function bind() {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
        }
    }
});