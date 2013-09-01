function Mesh() {
            this.transform = new Transform();

            this.vertexShader = null;
            this.fragmentShader = null;

            this.shaderProgram = null;

            this.vertexBuffer = null;
            this.indexBuffer = null;
            this.texturecoordBuffer = null;

            this.texture = null;

            /* Drawing modes.
                gl.POINTS
                gl.LINES
                gl.LINE_LOOP
                gl.LINE_STRIP
                gl.TRIANGLES
                gl.TRIANGLE_STRIP
                gl.TRIANGLE_FAN
            */
            this.drawMode = gl.TRIANGLES;
            this.vec4Color = new Float32Array(4);
            this.vec4Color[0] = 1.0,
            this.vec4Color[1] = 1.0,
            this.vec4Color[2] = 1.0,
            this.vec4Color[3] = 1.0;
}

// Statics
Object.defineProperties(Mesh, {
    CreateTriangleMesh: {
        value: function CreateTriangleMesh(idVertexShader, idFragmentShader) {
            var mesh = new Mesh();

            mesh.vertexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            var vertices = [
                 0.0, 1.0, 0.0,
                -1.0, -1.0, 0.0,
                 1.0, -1.0, 0.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            mesh.vertexBuffer.itemSize = 3;
            mesh.vertexBuffer.numItems = 3;

            mesh.vertexShader = arrayVertexShaders[idVertexShader];
            mesh.fragmentShader = arrayFragmentShaders[idFragmentShader];

            mesh.drawMode = gl.TRIANGLES;
            return mesh;
        }
    },
    CreateSquareMesh: {
        value: function CreateSquareMesh(idVertexShader, idFragmentShader) {
            var mesh = new Mesh();

            mesh.vertexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            var vertices = [
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
                1.0, -1.0, 0.0,
                -1.0, -1.0, 0.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            mesh.vertexBuffer.itemSize = 3;
            mesh.vertexBuffer.numItems = 4;

            mesh.vertexShader = arrayVertexShaders[idVertexShader];
            mesh.fragmentShader = arrayFragmentShaders[idFragmentShader];

            mesh.drawMode = gl.TRIANGLE_STRIP;

            return mesh;
        }
    },
    CreateTexturedSquareMesh: {
        value: function CreateTexturedSquareMesh(idVertexShader, idFragmentShader, pathToTexture) {
            var mesh = new Mesh();

            // Buffer vertices
            mesh.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            var vertices = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            mesh.vertexBuffer.itemSize = 3;
            mesh.vertexBuffer.numItems = 4;

            // Buffer indexes
            mesh.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
            var indices = [
                0, 1, 2,      0, 2, 3
            ];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            
            mesh.indexBuffer.itemSize = 1;
            mesh.indexBuffer.numItems = 6;

            // Load texture
            if (!pathToTexture)
                console.error("Mesh.CreateTexturedSquareMesh() - No 'pathToTexture' args passed!");
            else {
                // Buffer Texture Coordinates
                mesh.texturecoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texturecoordBuffer);
                var textureCoordinates = [
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                              gl.STATIC_DRAW);

                mesh.texturecoordBuffer.itemSize = 2;
                mesh.texturecoordBuffer.numItems = 4;

                mesh.texture = Texture.LoadTexture(pathToTexture);
            }

            mesh.vertexShader = arrayVertexShaders[idVertexShader];
            mesh.fragmentShader = arrayFragmentShaders[idFragmentShader];

            mesh.drawMode = gl.TRIANGLES;

            return mesh;
        }
    },
    CreateTexturedAlphaSquareMesh: {
        value: function CreateTexturedAlphaSquareMesh(idVertexShader, idFragmentShader, pathToTexture) {
            var mesh = new Mesh();

            // Buffer vertices
            mesh.vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
            var vertices = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            mesh.vertexBuffer.itemSize = 3;
            mesh.vertexBuffer.numItems = 4;

            // Buffer indexes
            mesh.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
            var indices = [
                0, 1, 2, 0, 2, 3
            ];
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

            mesh.indexBuffer.itemSize = 1;
            mesh.indexBuffer.numItems = 6;

            // Load texture
            if (!pathToTexture)
                console.error("Mesh.CreateTexturedSquareMesh() - No 'pathToTexture' args passed!");
            else {
                // Buffer Texture Coordinates
                mesh.texturecoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, mesh.texturecoordBuffer);
                var textureCoordinates = [
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0,
                    0.0, 1.0
                ];
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                              gl.STATIC_DRAW);

                mesh.texturecoordBuffer.itemSize = 2;
                mesh.texturecoordBuffer.numItems = 4;

                mesh.texture = Texture.LoadTexture(pathToTexture);
                mesh.texture.hasAlphaChannel = true;
            }

            mesh.vertexShader = arrayVertexShaders[idVertexShader];
            mesh.fragmentShader = arrayFragmentShaders[idFragmentShader];

            mesh.drawMode = gl.TRIANGLES;

            return mesh;
        }
    }
});

// Instance methods
Object.defineProperties(Mesh.prototype, {
    setRGBA: {
        value: function setRGBA(r, g, b, a) {
            this.vec4Color[0] = r;
            this.vec4Color[1] = g;
            this.vec4Color[2] = b;
            this.vec4Color[3] = a;
        }
    },
    draw: {
        value: function draw() {
            WEBGLAM.mesh = this;        // Accessed by shaders on global.

            mvPushMatrix();
            mvIdentity();
            this.transform.render();

            if (!this.shaderProgram)
                this.shaderProgram = buildShaderProgram(this.vertexShader, this.fragmentShader);

            if (this.texture) {
                if (this.texture.hasAlphaChannel) {
                    gl.disable(gl.DEPTH_TEST);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, this.texturecoordBuffer);
                gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)
                this.texture.bind();
            }

            useShaderProgram(this.shaderProgram); // must be called after texture.draw();

            // Bind vertex buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            // Bind index buffers
            if (this.indexBuffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                gl.drawElements(this.drawMode, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.drawArrays(this.drawMode, 0, this.vertexBuffer.numItems);
            }

            // Reset Blend state State
            if (this.texture) {
                if (this.texture.hasAlphaChannel)
                    gl.enable(gl.DEPTH_TEST);
                    gl.disable(gl.BLEND);
            }

            mvPopMatrix();
        }
    }
});