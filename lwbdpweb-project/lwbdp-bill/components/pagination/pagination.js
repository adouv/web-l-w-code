(function ($) {

    $.lwPageCalculator = function (maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
    };

    $.extend($.lwPageCalculator.prototype, {

        numPages: function () {
            return Math.ceil(this.maxentries / this.opts.items_per_page);
        },

        getInterval: function (current_page) {
            var ne_half = Math.floor(this.opts.num_display_entries / 2);
            var np = this.numPages();
            var upper_limit = np - this.opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half + (this.opts.num_display_entries % 2), np) : Math.min(this.opts.num_display_entries, np);

            if (np == 1) {
                //alert("只有一页,不显示前一页后一页");
                this.opts.prev_show_always = false;
                this.opts.next_show_always = false;
            }
            return {start: start, end: end};
        }
    });


    $.lwPageRenderers = {}


    $.lwPageRenderers.defaultRenderer = function (maxentries, opts) {
        this.maxentries = maxentries;
        this.opts = opts;
        this.pc = new $.lwPageCalculator(maxentries, opts);
    }

    $.extend($.lwPageRenderers.defaultRenderer.prototype, {

        createLink: function (page_id, current_page, appendopts) {
            var lnk, np = this.pc.numPages();
            page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
            appendopts = $.extend({text: page_id + 1, classes: ""}, appendopts || {});
            if (page_id == current_page) {
                lnk = $("<span class='current'>" + appendopts.text + "</span>");
            }
            else {
                lnk = $("<a>" + appendopts.text + "</a>")
                    .attr('href', this.opts.link_to.replace(/__id__/, page_id));
            }
            if (appendopts.classes) {
                lnk.addClass(appendopts.classes);
            }
            lnk.data('page_id', page_id);
            return lnk;
        },
        // Generate a range of numeric links
        appendRange: function (container, current_page, start, end, opts) {
            var i;
            for (i = start; i < end; i++) {
                this.createLink(i, current_page, opts).appendTo(container);
            }
        },
        getLinks: function (current_page, eventHandler, psize) {
            var $page = this;
            var begin, end,
                interval = this.pc.getInterval(current_page),
                np = this.pc.numPages(),
                fragment = $("<div class='lwPage'></div>");
            if (!psize) np = Math.ceil(this.maxentries / psize);
            // Generate "Previous"-Link
            if (this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)) {
                fragment.append(this.createLink(current_page - 1, current_page, {
                    text: this.opts.prev_text,
                    classes: "prev"
                }));
            }
            // Generate starting points
            if (interval.start > 0 && this.opts.num_edge_entries > 0) {
                end = Math.min(this.opts.num_edge_entries, interval.start);
                this.appendRange(fragment, current_page, 0, end, {classes: 'sp'});
                if (this.opts.num_edge_entries < interval.start && this.opts.ellipse_text) {
                    jQuery("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
            }
            // Generate interval links
            this.appendRange(fragment, current_page, interval.start, interval.end);
            // Generate ending points
            if (interval.end < np && this.opts.num_edge_entries > 0) {
                if (np - this.opts.num_edge_entries > interval.end && this.opts.ellipse_text) {
                    jQuery("<span>" + this.opts.ellipse_text + "</span>").appendTo(fragment);
                }
                begin = Math.max(np - this.opts.num_edge_entries, interval.end);
                this.appendRange(fragment, current_page, begin, np, {classes: 'ep'});

            }
            // Generate "Next"-Link
            if (this.opts.next_text && (current_page < np - 1 || this.opts.next_show_always)) {
                fragment.append(this.createLink(current_page + 1, current_page, {
                    text: this.opts.next_text,
                    classes: "next"
                }));
            }
            $('a', fragment).click(eventHandler);
            var psize = (current_page + 1);
            var proxySzie = (psize >= this.maxentries) ? this.maxentries : psize;
            if (this.opts.showSelect) fragment.prepend("<a href='javascript:void(0);'>共<label class='tmui_page_itemcount'>"+this.maxentries+"</label>条</a><select class='tm_psize_go'><option value='10'>10</option><option value='15'>15</option><option value='20'>20</option><option value='25'>25</option><option value='30'>30</option><option value='35'>35</option><option value='40'>40</option><option value='45'>45</option><option value='50'>50</option></select>");
            if (this.opts.showGo) fragment.append("<input type='text' title='请输入其他页码'  class='tm_number' value='' id='tm_pagego'/> <a href='javascript:void(0);' title='请输入其他页码' style='' class='tm_go'>&#xe603;</a>");
            return fragment;

        }
    });

    // Extend jQuery
    $.fn.lwPage = function (maxentries, opts) {
        // Initialize options with default values
        opts = jQuery.extend({
            items_per_page: 5,
            num_display_entries: 5,
            current_page: 0,
            num_edge_entries: 0,
            link_to: "javascript:void(0)",
            prev_text: "&#xe745",
            next_text: "&#xe8d2",
            ellipse_text: "...",
            prev_show_always: true,
            next_show_always: true,
            renderer: "defaultRenderer",
            load_first_page: false,
            showGo: true,
            showSelect: true,
            callback: function () {
                return false;
            },
            goback: function () {
            }
        }, opts || {});
        var containers = this,
            renderer, links, current_page;

        function lwPageClickHandler(evt) {
            var links,
                new_current_page = $(evt.target).data('page_id'),
                continuePropagation = selectPage(new_current_page);
            if (!continuePropagation) {
                evt.stopPropagation();
            }
            return continuePropagation;
        }


        function selectPage(new_current_page) {
            // update the link display of a all containers
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, lwPageClickHandler);
            containers.empty();
            links.appendTo(containers);
            /*$(".tm_number").attr("title", " 请输入数字...").on("keydown",
             function(e) {
             return true;
             });*/
            // call the callback and propagate the event if it does not return false
            var continuePropagation = opts.callback(new_current_page * opts.items_per_page, opts.items_per_page, containers);

            init();
            return continuePropagation;
        }

        function selectPage_psize(new_current_page, psize) {
            // update the link display of a all containers
            containers.data('current_page', new_current_page);
            links = renderer.getLinks(new_current_page, lwPageClickHandler, psize);
            containers.empty();
            links.appendTo(containers);
            containers.find(".tm_psize_go").find("option[value='" + psize + "']").attr("selected", true);
            /*$(".tm_number").attr("title", " 请输入数字...").on("keydown",
             function(e) {
             return true;
             });*/
            // call the callback and propagate the event if it does not return false
            var continuePropagation = opts.callback(new_current_page, psize, containers);
            init();
            return continuePropagation;
        }

        // -----------------------------------
        // Initialize containers
        // -----------------------------------
        current_page = opts.current_page;
        containers.data('current_page', current_page);
        // Create a sane value for maxentries and items_per_page
        var ishow = !maxentries;
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        if (!$.lwPageRenderers[opts.renderer]) {
            throw new ReferenceError("lwPage renderer '" + opts.renderer + "' was not found in jQuery.lwPageRenderers object.");
        }
        renderer = new $.lwPageRenderers[opts.renderer](maxentries, opts);

        // Attach control events to the DOM elements
        var pc = new $.lwPageCalculator(maxentries, opts);
        var np = pc.numPages();
        if (np == 0) {
            containers.hide();
        } else {
            containers.show();
        }
        containers.bind('setPage', {numPages: np}, function (evt, page_id) {
            if (page_id >= 0 && page_id < evt.data.numPages) {
                selectPage(page_id);
                return false;
            }
        });
        containers.bind('prevPage', function (evt) {
            var current_page = $(this).data('current_page');
            if (current_page > 0) {
                selectPage(current_page - 1);
            }
            return false;
        });
        containers.bind('nextPage', {numPages: np}, function (evt) {
            var current_page = $(this).data('current_page');
            if (current_page < evt.data.numPages - 1) {
                selectPage(current_page + 1);
            }
            return false;
        });

        // When all initialisation is done, draw the links
        links = renderer.getLinks(current_page, lwPageClickHandler);
        containers.empty();
        links.appendTo(containers);
        // call callback function
        if (opts.load_first_page) {
            opts.callback(current_page, containers);
        }

        init();
        function init() {
            containers.find(".tm_psize_go").find("option[value='" + opts.items_per_page + "']").attr("selected", true);
            $('.tm_go', containers).on("click", function (e) {
                var goPage = $("#tm_pagego").val();
                var current_page = containers.data('current_page');
                if (goPage && !isNaN(goPage)) {
                    //if(goPage>np)return;
                    var maxPage = pc.numPages();
                    if (goPage > maxPage) {
                        goPage = maxPage;
                    }
                    var pno = goPage - 1;
                    if (pno == current_page) {
                        $("#tm_pagego").val(goPage)
                        return;
                    };
                    if (goPage <= 0) {
                        $("#tm_pagego").val(1);
                        pno = 0;
                    }

                    if (goPage > maxPage) {
                        $("#tm_pagego").val(maxPage - 1);
                        pno = maxPage - 1;
                    }
                    selectPage(pno);
                } else {
                    $("#tm_pagego").focus();
                }
                if (e && e.stopPropagation)
                    e.stopPropagation();
                else
                    window.event.cancelBubble = true;
            });

            $('.tm_psize_go', containers).on("change", function (e) {
                var pageSize = $(this).val();
                opts.items_per_page = pageSize;
                selectPage_psize(0, pageSize);
                var current_page = containers.data('current_page');
            });

            /*$(".tm_number").attr("title", " 请输入数字...").on("keydown",
             function(e) {
             return true;
             });*/
        }
    } // End of $.fn.lwPage block

})(jQuery);

