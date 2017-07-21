'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {StyleRoot} from 'radium';
import {Treebeard, decorators} from '../src/index';

import data from './data';
import styles from './styles';
import * as filters from './filter';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

class NodeViewer extends React.Component {
    render() {
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);

        if (!json) {
            json = HELP_MSG;
        }

        return <div style={style.base}>{json}</div>;
    }
}
NodeViewer.propTypes = {
    node: PropTypes.object
};

class DemoTree extends React.Component {
    constructor() {
        super();

        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e, node) {
        e.stopPropagation();
        const {activeNode} = this.state;

        if (activeNode) {
            activeNode.active = false;
        }

        node.active = true;

        this.setState({activeNode: node});
    }

    onToggle(node, toggled) {
        const {toggledNode} = this.state;

        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({toggledNode: node});
    }

    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState({data});
        }
        var filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }

    onEdit(e, node) {
        e.stopPropagation();
        console.log('Editing ', node);
    }

    render() {
        const {data: stateData, toggledNode} = this.state;

        return (
            <StyleRoot>
                <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </div>
                </div>
                <div style={styles.component}>
                    <Treebeard data={stateData}
                               decorators={decorators}
                               onToggle={this.onToggle}
                               onClick={this.onClick}
                               customProps={{onEdit: this.onEdit}}/>
                </div>
                <div style={styles.component}>
                    <NodeViewer node={toggledNode} />
                </div>
            </StyleRoot>
        );
    }
}

const content = document.getElementById('content');
ReactDOM.render(<DemoTree/>, content);
