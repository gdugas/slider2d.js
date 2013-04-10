(function ($) {
    
    $.widget("ui.slider2d", {
        options: {
            'xvalue': 0,
            'yvalue': 0,
            'revert': false,
            'xmin': null,
            'xmax': null,
            'ymin': null,
            'ymax': null
        },
        
        initials: {
            'class': '',
            'xvalue': 0,
            'yvalue': 0
        },
        
        // INITIALIZATION METHODS
        _create: function () {
            this._initElement();
            this._initSlider();
            this._initHandler();
            this._checkBound();
            this._initValues();
        },
        
        _initElement: function () {
            this.$el = $(this.element);
            this.initials.class = this.$el.attr('class');
            this.$el.addClass('slider2d ui-slider ui-widget ui-widget-content ui-corner-all');
        },
        
        _initSlider: function () {
            this.$slider = $('<div></div>');
            this.$slider.css({
                'position': 'relative',
                'width': this.$el.width(),
                'height': this.$el.height()
            });
            this.$el.append(this.$slider);
        },
        
        _initHandler: function () {
            var self = this;
            this.$handler = $('<div></div>');
            this.$handler.addClass('ui-slider-handle ui-state-default ui-corner-all');
            this.$handler.css('position', 'absolute');
            this.$slider.append(this.$handler);
            this.$handler.draggable({
                containment: this.$slider,
                drag: function (e, ui) {
                    self._onHandlerDrag(this, e, ui);
                },
                start: function (e, ui) {
                    self._onHandlerStart(this, e, ui);
                },
                stop: function (e, ui) {
                    self._onHandlerStop(this, e, ui);
                }
            });
        },
        
        _initValues: function () {
            this._setValues(this.options.xvalue, this.options.yvalue);
        },
        
        _destroy: function () {
            this.$slider.detach();
            this.$el.attr('class', this.initials.class);
        },
        
        _checkBound: function () {
            var min;
            for (min in ['xmin', 'ymin']) {
                if (this.options[min] === null) {
                    this.options[min] = 0;
                }
            }
            
            if (this.options.xmax === null) {
                this.options.xmax = this.$slider.width();
            }
            if (this.options.ymax === null) {
                this.options.ymax = this.$slider.height();
            }
            
            if (this.options.xmin == this.options.xmax) {
                throw "xmin and xmax positions could not be equals";
            }
            if (this.options.ymin == this.options.ymax) {
                throw "ymin and ymax positions could not be equals";
            }
        },
        
        _setValues: function (xvalue, yvalue) {
            if (xvalue < this.options.xmin || xvalue > this.options.xmax) {
                throw "x value ("+xvalue+") is out of range ("+this.options.xmin+", "+this.options.xmax+")";
            }
            
            if (yvalue < this.options.ymin || yvalue > this.options.ymax) {
                throw "y value ("+yvalue+") is out of range ("+this.options.ymin+", "+this.options.ymax+")";
            }
            
            this.$handler.css({
                'top': this._unprojectY(yvalue),
                'left': this._unprojectX(xvalue)
            });
            this.options.xvalue = xvalue;
            this.options.yvalue = yvalue;
        },
        
        /*
         * project methods: convert css positionning to x and y values
         */
        _projectX: function (x) {
            var width = this.$slider.width() - this.$handler.width(),
                ratio = x / width,
                xvalue = this.options.xmin + (this.options.xmax - this.options.xmin) * ratio;
            return xvalue;
        },
        
        _projectY: function (y) {
            var height = this.$slider.height() - this.$handler.height(),
                ratio = y / height,
                yvalue = this.options.ymin + (this.options.ymax - this.options.ymin) * ratio;
            return yvalue;
        },
        
        /*
         * unproject methods: convert x and y values to css positionning
         */
        _unprojectX: function (xvalue) {
            var width = this.options.xmax - this.options.xmin,
                xvalue = - this.options.xmin,
                ratio = xvalue / width,
                x = (this.$slider.width() - this.$handler.width()) * ratio;
            return x;
        },
        
        _unprojectY: function (yvalue) {
            var height = this.options.ymax - this.options.ymin,
                yvalue = - this.options.ymin,
                ratio = yvalue / height,
                y = (this.$slider.height() - this.$handler.height()) * ratio;
            return y;
        },
        
        _setOptions: function (options) {
            if (options.xvalue && options.yvalue) {
                this._setValues(options.xvalue, options.yvalue);
                delete options.xvalue;
                delete options.yvalue;
            
            } else if (options.xvalue) {
                this._setValues(options.xvalue, this.options.yvalue);
                delete options.xvalue;
            
            } else if (options.yvalue) {
                this._setValues(this.options.xvalue, options.yvalue);
                delete options.yvalue;
            }
            this._superApply([options]);
        },
        
        _onHandlerDrag: function (handler, e, ui) {
            this.options.xvalue = this._projectX(ui.position.left);
            this.options.yvalue = this._projectY(ui.position.top);
            this._trigger('slide', {
                xvalue: this.options.xvalue,
                yvalue: this.options.yvalue
            });
        },
        
        _onHandlerStart: function (handler, e, ui) {
            this.onstart = {
                xvalue: this.options.xvalue,
                yvalue: this.options.yvalue
            };
            this._trigger('start', {
                xvalue: this.options.xvalue,
                yvalue: this.options.yvalue
            });
        },
        
        _onHandlerStop: function (handler, e, ui) {
            if (this.options.revert) {
                this._setValues(this.onstart.xvalue, this.onstart.yvalue);
            }
            delete this.onstart;
            this._trigger('stop', {
                xvalue: this.options.xvalue,
                yvalue: this.options.yvalue
            });
        }
    });

})(jQuery);
