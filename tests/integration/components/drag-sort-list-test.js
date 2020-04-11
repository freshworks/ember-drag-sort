import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { find, findAll, render, settled } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import trigger from 'ember-drag-sort/utils/trigger'
import sinon from 'sinon'
import { A }  from '@ember/array'



module('Integration | Component | drag-sort-list', function (hooks) {
  setupRenderingTest(hooks)

  test('it works', async function (assert) {
    const items = A([
      {name : 'foo'},
      {name : 'bar'},
      {name : 'baz'},
    ])

    const dragEndCallback = sinon.spy()

    const additionalArgs = {parent : 'test'}

    this.setProperties({additionalArgs, items, dragEndCallback})

    await render(hbs`
      {{#drag-sort-list
        additionalArgs = additionalArgs
        items          = items
        dragEndAction  = (action dragEndCallback)
        as |item|
      }}
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-list}}
    `)

    const itemElements   = findAll('.dragSortItem')
    const [item0, item1] = itemElements

    trigger(item0, 'dragstart')
    trigger(item1, 'dragover', false)
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.calledOnce)

    assert.ok(dragEndCallback.calledWithExactly({
      group       : undefined,
      draggedItem : items.objectAt(0),
      sourceArgs  : {parent : 'test'},
      sourceList  : items,
      targetArgs  : {parent : 'test'},
      targetList  : items,
      sourceIndex : 0,
      targetIndex : 1,
    }))
  })



  test('sorting with neither dragover nor dragenter', async function (assert) {
    const items = A([
      {name : 'foo'},
      {name : 'bar'},
      {name : 'baz'},
    ])

    const dragEndCallback = sinon.spy()

    this.setProperties({items, dragEndCallback})

    await render(hbs`
      {{#drag-sort-list
        items         = items
        dragEndAction = (action dragEndCallback)
        as |item|
      }}
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-list}}
    `)

    const item0 = find('.dragSortItem')

    trigger(item0, 'dragstart')
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.notCalled)
  })



  test('drag handle', async function (assert) {
    const items = A([
      {name : 'foo'},
      {name : 'bar'},
      {name : 'baz'},
    ])

    const dragEndCallback = sinon.spy()

    this.setProperties({items, dragEndCallback})

    await render(hbs`
      {{#drag-sort-list
        items         = items
        dragEndAction = (action dragEndCallback)
        handle        = ".handle"
        as |item|
      }}
        <div class="handle">handle</div>
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-list}}
    `)

    const itemElements   = findAll('.dragSortItem')
    const [item0, item1] = itemElements

    trigger(item0, 'dragstart')
    trigger(item1, 'dragover', false)
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.notCalled)

    trigger(item0.querySelector('.handle'), 'dragstart')
    trigger(item1, 'dragover', false)
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.calledOnce)

    assert.ok(dragEndCallback.calledWithExactly({
      group       : undefined,
      draggedItem : items.objectAt(0),
      sourceArgs  : undefined,
      sourceList  : items,
      targetArgs  : undefined,
      targetList  : items,
      sourceIndex : 0,
      targetIndex : 1,
    }))
  })



  test('nested drag handle', async function (assert) {
    const items = A([
      {name : 'foo'},
      {name : 'bar'},
      {name : 'baz'},
    ])

    const dragEndCallback = sinon.spy()

    this.setProperties({items, dragEndCallback})

    await render(hbs`
      {{#drag-sort-list
        items         = items
        dragEndAction = (action dragEndCallback)
        handle        = ".handle"
        as |item|
      }}
        <div class="handle">
          <div class="handle2">handle</div>
        </div>
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-list}}
    `)

    const itemElements   = findAll('.dragSortItem')
    const [item0, item1] = itemElements

    trigger(item0, 'dragstart')
    trigger(item1, 'dragover', false)
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.notCalled)

    trigger(item0.querySelector('.handle2'), 'dragstart')
    trigger(item1, 'dragover', false)
    trigger(item0, 'dragend')

    await settled()

    assert.ok(dragEndCallback.calledOnce)

    assert.ok(dragEndCallback.calledWithExactly({
      group       : undefined,
      draggedItem : items.objectAt(0),
      sourceArgs  : undefined,
      sourceList  : items,
      targetArgs  : undefined,
      targetList  : items,
      sourceIndex : 0,
      targetIndex : 1,
    }))
  })

  test('occlusion rederer without threshold', async function (assert) {
    let arr = [ ]

    for (let i = 1; i <= 100; i++) {
      arr.push({name : `item ${i}`})
    }

    this.setProperties({
      items             : A(arr),
      lazyRenderEnabled : false,
    })

    await render(hbs`
      {{#drag-sort-occlusion-list
        lazyRenderEnabled  = lazyRenderEnabled
        class              = "height--400"
        items              = items
        estimateItemHeight = 30
        as |item|
      }}
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-occlusion-list}}
    `)

    const itemList = find('.dragSortList')
    assert.dom(itemList).doesNotHaveClass('-isLazyRenderActive')
    assert.equal(findAll('.dragSortItem').length, arr.length)

    this.set('lazyRenderEnabled', true)
    await settled()

    itemList.scrollTop = itemList.scrollHeight
    await settled()

    assert.ok(itemList.scrollTop > 0, 'Item List should scroll')
    assert.dom(itemList).hasClass('-isLazyRenderActive')
    assert.notEqual(findAll('.dragSortItem').length, arr.length)
  })


  test('occlusion rederer with threshold', async function (assert) {
    let arr = [ ]

    for (let i = 1; i <= 20; i++) {
      arr.push({name : `item ${i}`})
    }

    this.setProperties({
      items          : A(arr),
      itemsThreshold : 20,
    })

    await render(hbs`
      {{#drag-sort-occlusion-list
        itemsThreshold     = itemsThreshold
        class              = "height--400"
        items              = items
        estimateItemHeight = 30
        as |item|
      }}
        <div>
          {{item.name}}
        </div>
      {{/drag-sort-occlusion-list}}
    `)

    // occlusion threshold not exceeded - renderer inactive
    const itemList = find('.dragSortList')
    assert.dom(itemList).doesNotHaveClass('-isLazyRenderActive')
    assert.equal(findAll('.dragSortItem').length, arr.length)

    // add 1 object - threshold exceeded - renderer active
    this.get('items').pushObject({name : 'item 21'})
    await settled()
    assert.dom(itemList).hasClass('-isLazyRenderActive')

    // Increase threshold - renderer de-active
    this.set('itemsThreshold', 21)
    await settled()
    assert.dom(itemList).doesNotHaveClass('-isLazyRenderActive')
  })
})
