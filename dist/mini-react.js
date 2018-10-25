'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function isEvent(propName) {
    return propName.startsWith('on');
}
//# sourceMappingURL=isEvent.js.map

function getEventName(event) {
    return event.substring(2).toLowerCase();
}
function patchEvents(el, prevVNode, nextVNode) {
    var prevProps = prevVNode.domProps;
    var nextProps = nextVNode.domProps;
    var prevPropsNames = Object.keys(prevProps);
    var nextPropsNames = Object.keys(nextProps);
    prevPropsNames.forEach(function (propName) {
        if (isEvent(propName)) {
            el.removeEventListener(getEventName(propName), prevProps[propName]);
        }
    });
    nextPropsNames.forEach(function (propName) {
        if (isEvent(propName)) {
            el.addEventListener(getEventName(propName), nextProps[propName]);
        }
    });
    return el;
}
//# sourceMappingURL=patchEvents.js.map

function patchDom(el, prevVNode, nextVNode, isCreating) {
    if (nextVNode.type == 'text') {
        if (nextVNode.textContent && prevVNode.textContent != nextVNode.textContent) {
            el.textContent = nextVNode.textContent.toString();
        }
        return el;
    }
    var prevProps = prevVNode.domProps;
    var nextProps = nextVNode.domProps;
    var prevPropsNames = Object.keys(prevProps);
    var nextPropsNames = Object.keys(nextProps);
    prevPropsNames
        .filter(function (propName) { return !nextPropsNames.includes(propName); })
        .forEach(function (propName) { return el.removeAttribute(propName); });
    if (isCreating) {
        nextPropsNames.forEach(function (propName) { return !isEvent(propName) && el.setAttribute(propName, nextProps[propName]); });
    }
    else {
        nextPropsNames
            .filter(function (propName) { return nextProps[propName] !== prevProps[propName] && !isEvent(propName); })
            .forEach(function (propName) { return el[propName] = nextProps[propName]; });
    }
    return patchEvents(el, prevVNode, nextVNode);
}
//# sourceMappingURL=patchDom.js.map

function createElementByText(_a) {
    var textContent = _a.textContent;
    if (textContent) {
        return document.createTextNode(textContent.toString());
    }
    return null;
}
function createElementByTagName(vNode) {
    var rawEl = document.createElement(vNode.tagName);
    var domEl = patchDom(rawEl, vNode, vNode, true);
    return domEl;
}
function createElement(vNode) {
    if (vNode.type === 'element') {
        return createElementByTagName(vNode);
    }
    return createElementByText(vNode);
}
//# sourceMappingURL=createElement.js.map

var isClass = function (clazz) {
    return typeof clazz === 'function' && /^\s*class\s+/.test(clazz.toString());
};
//# sourceMappingURL=isClass.js.map

function createComponentInstance(Component, props) {
    var componentInstance = null;
    if (isClass(Component)) {
        componentInstance = new Component(props);
    }
    else {
        componentInstance = Component;
    }
    return componentInstance;
}
//# sourceMappingURL=createComponentInstance.js.map

function getVNode(element) {
    if (element.render) {
        return element.render();
    }
    return element;
}
function createInstance(element) {
    var vNode = getVNode(element);
    if (vNode.type !== 'component') {
        var domEl_1 = createElement(vNode);
        var rawInstance = {
            domEl: domEl_1,
            vNode: vNode,
            childInstances: []
        };
        if (domEl_1 && vNode.children && vNode.children.length > 0) {
            var childInstances = vNode.children.map(createInstance);
            childInstances.forEach(function (_a) {
                var childDomEl = _a.domEl;
                return (childDomEl && domEl_1.appendChild(childDomEl));
            });
            rawInstance.childInstances = childInstances;
        }
        if (element.render) {
            rawInstance.instance = element;
            element.$instance = rawInstance;
        }
        return rawInstance;
    }
    var componentInstance = createComponentInstance(element.component, vNode.props);
    var newInstance = createInstance(componentInstance);
    return __assign({}, newInstance, { instance: componentInstance, componentInstance: newInstance });
}
//# sourceMappingURL=createInstance.js.map

var rootInstanceTree;
function patch(parentEl, element, instanceTree, isRoot) {
    if (!instanceTree) {
        var newInstance = createInstance(element);
        var newEl = newInstance.domEl;
        if (isRoot) {
            parentEl.replaceWith(newEl);
        }
        else {
            parentEl.appendChild(newEl);
        }
        return newInstance;
    }
    if (!element) {
        parentEl.removeChild(instanceTree.domEl);
        return null;
    }
    var oldVNode = instanceTree.vNode;
    if (element.type === 'component') {
        var newInstance = createInstance(element);
        var newVNode_1 = newInstance.vNode;
        newVNode_1.props = instanceTree.instance.props;
        return patch(parentEl, newVNode_1, instanceTree.componentInstance);
    }
    var currentInstance = instanceTree;
    var newVNode = getVNode(element);
    instanceTree.vNode = newVNode;
    instanceTree.domEl = patchDom(parentEl, oldVNode, newVNode);
    if (newVNode.children) {
        patchChildren(currentInstance.childInstances, newVNode.children);
    }
    return currentInstance;
}
function patchChildren(childInstances, nextChildElements) {
    if (nextChildElements === void 0) { nextChildElements = []; }
    var newChildInstances = [];
    var count = Math.max(childInstances.length, nextChildElements.length);
    for (var i = 0; i < count; i++) {
        var childInstance = childInstances[i];
        var childElement = nextChildElements[i];
        var newChildInstance = patch(childInstance.domEl, childElement, childInstance);
        newChildInstances.push(newChildInstance);
    }
    return newChildInstances;
}
function render(Component, el) {
    rootInstanceTree = patch(el, Component, rootInstanceTree, true);
}
//# sourceMappingURL=render.js.map

function reRender(ctx) {
    var context = ctx.$instance;
    var domEl = context.domEl;
    if (domEl) {
        ctx.$instance = patch(domEl, context.instance, context);
    }
}
var Component = /** @class */ (function () {
    function Component(props, el) {
        this.state = null;
        this.$instance = null;
        this.props = props;
    }
    Component.prototype.setState = function (stateFn) {
        var newState = stateFn();
        if (this.state !== newState) {
            this.state = __assign({}, this.state, newState);
            reRender(this);
        }
    };
    Component.prototype.render = function () {
        return null;
    };
    return Component;
}());
//# sourceMappingURL=component.js.map

function createVNode(node) {
    var tagName = node.tagName, textContent = node.textContent, children = node.children, props = node.props, component = node.componentClass, domProps = __rest(node, ["tagName", "textContent", "children", "props", "componentClass"]);
    var vNode = {
        type: 'component',
        props: props || {},
        domProps: domProps || {},
        children: children || []
    };
    if (component) {
        vNode.component = component;
    }
    else if (tagName) {
        vNode.tagName = tagName;
        vNode.type = 'element';
    }
    if (textContent && vNode.children) {
        vNode.children.unshift({
            domProps: {},
            props: {},
            textContent: textContent,
            type: 'text'
        });
    }
    return vNode;
}
//# sourceMappingURL=createVNode.js.map

function node(vNode) {
    return createVNode(vNode);
}
//# sourceMappingURL=node.js.map

var w = window;
w.Component = Component;
w.node = node;
w.MiniReact = {
    render: render
};
//# sourceMappingURL=index.js.map
