---
title: 'How to show comment count on article or page'
date: 2017-05-01T22:12:03.284Z
category: 'FAQ'
tags:
  - how to
  - show
  - comment count

path: '/how-to-show-comment-count-on-article-or-page/'
shortDescription: 'In this modern day, user engagement is very important and you can improve it if you show comment count on your article or page.'
---
In this modern day, user engagement is very important and you can improve it if you show comment count on your article or page.

You can easily display comment count without adding any additional API calls on the page – simply add following HTML Data Attribute in the comment count anchor tag:

`<a data="vuukle-count" href="#vuukle-comments">comments</a>`

Also the count can be displayed with even more handy form:

`<a href="#"><span data="vuukle-count" data-empty-text="Add a">0</span> Comments</a>`


To display the comment count for endless mode, the vuukle count element should be:

`<a data="vuukle-count-[index]" href="#vuukle-comments">comments</a>`

Also it can be:

`<a href="#"><span data="vuukle-count-[index]" data-empty-text="Add a">0</span> Comments</a>`

Instead of `[index]`, you should use the index used to generate the widgets in endless mode.
