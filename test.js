import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

test('filter out z-indexed elements', t => {
    let root = postcss.parse('.div { color: black; position: fixed; } .span { color: white; position: relative; z-index: 1}');
    let expected = postcss.parse('.div{color: black;position: fixed;}');
    let opts = { props: ['z-index'], exclude: true };
    return postcss([
      plugin(opts)
    ]).process(root, opts).then(result => {
        t.is(result.css, expected);
        t.is(result.warnings().length, 0);
    });
});

test('keep only z-indexed elements', t => {
    let root = postcss.parse('.div { color: black; position: fixed; } .span { color: white; position: relative; z-index: 1}');
    let expected = postcss.parse('.span{color: white; position: relative; z-index: 1}');
    let opts = { props: ['z-index'] };
    return postcss([
      plugin(opts)
    ]).process(root, opts).then(result => {
        t.is(result.css, expected);
        t.is(result.warnings().length, 0);
    });
});