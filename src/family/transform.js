export default function transform(data, parentMaleOnLeft) {
    const _rawData = JSON.stringify(data);

    const fetchData = () => {
        return JSON.parse(_rawData);
    }

    const getParents = ({
        get: function () {
            let data = fetchData();

            return (data.find(n => n.id === this.id) || {
                parents: []
            }).parents.map(p => Object.defineProperties(p, defaultProperties));
        }
    });

    const getChildren = ({
        get: function () {
            let data = fetchData();

            return data.filter(n => n.parents.some(p => p.id === this.id)).map(p => Object.defineProperties(p, defaultProperties));
        }
    });

    const getSiblings = ({
        get: function () {
            let data = fetchData();

            return data.filter(n => n.parents.some(p => this.parents.some(mp => mp.id === p.id && this.id !== n.id))).map(p => Object.defineProperties(p, defaultProperties));
        }
    });

    const getRight = ({
        get: function () {
            return parentMaleOnLeft ? this.gender === 'F' : this.gender === 'M';
        }
    });

    let defaultProperties = {
        'parents': getParents,
        'children': getChildren,
        'siblings': getSiblings,
        'onRight': getRight
    }

    return data.map(node => Object.defineProperties(node, defaultProperties));
}