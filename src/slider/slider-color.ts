/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { html, LitElement, property } from 'lit-element';

import sliderColorStyles from './slider-color.css';
import sliderSkinStyles from './slider-skin.css';
import sliderStyles from './slider.css';

export type ISliderColorEventDetail = number;

export class SliderColor extends LitElement {
    public static is = 'sp-slider-color';

    public static get styles() {
        return [sliderStyles, sliderSkinStyles, sliderColorStyles];
    }

    @property()
    public type = '';

    @property({ type: Number })
    public value = 10;

    @property()
    public label = '';

    @property({ type: Number })
    public max = 20;

    @property({ type: Number })
    public min = 0;

    @property({ type: Number })
    public step = 1;

    @property({ type: Boolean, reflect: true })
    public disabled = false;

    @property({ type: Boolean, reflect: true })
    public dragging = false;

    public onInput(ev: Event) {
        if (!this.inputElement) {
            return;
        }
        const inputValue = this.inputElement.value;

        this.value = parseFloat(inputValue);

        const inputEvent = new CustomEvent<ISliderColorEventDetail>(
            'slider-input',
            {
                bubbles: true,
                composed: true,
                detail: this.value,
            }
        );

        this.dispatchEvent(inputEvent);
    }

    public onChange(ev: Event) {
        const changeEvent = new CustomEvent<ISliderColorEventDetail>(
            'slider-change',
            {
                bubbles: true,
                composed: true,
                detail: this.value,
            }
        );

        this.dispatchEvent(changeEvent);
    }
    protected render() {
        return html`
            <div id="labelContainer">
                <label id="label" for="input">${this.label}</label>
                <div id="value" role="textbox" aria-readonly="true" aria-labelledby="label">
                    ${this.value}
                </div>
            </div>
            <div id="controls">
                <input type="range"
                      id="input"
                      value="${this.value}"
                      step="${this.step}"
                      min="${this.min}"
                      max="${this.max}"
                      @change="${this.onChange}"
                      @input=${this.onInput}
                      @mousedown=${this.onMouseDown}
                      @mouseup=${this.onMouseUp}
                  />
                <div class="track"></div>
                <div id="handle" style="${this.handleStyle}"></div>
                </div>
            </div>
        `;
    }

    private onMouseDown() {
        this.dragging = true;
    }

    private onMouseUp() {
        this.dragging = false;
    }

    private get inputElement() {
        if (!this.shadowRoot) {
            return null;
        }
        return this.shadowRoot.getElementById('input') as HTMLInputElement;
    }

    /**
     * Ratio representing the slider's position on the track
     */
    private get trackProgress(): number {
        return this.value / this.max;
    }

    private get handleStyle(): string {
        return `left: ${this.trackProgress * 100}%`;
    }
}
