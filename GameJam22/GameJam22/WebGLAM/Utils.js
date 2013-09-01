﻿"use strict";

if (!Math.clamp) {
    Math.clamp = function clamp(min, max, value) {
        if (value >= min) {
            if (value <= max) {
                return value;
            }
            else {
                return max;
            }
        }
        else {
            return min;
        }
    }
}