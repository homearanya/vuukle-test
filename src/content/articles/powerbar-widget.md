---
title: PowerBar widget and everything you need to know about it
path: /powerbar-widget/
date: 2017-08-23T15:30:37.862Z
category: Vuukle Widgets
tags:
  - widgets
  - powerbar
  - wordpress
  - javascript
  - blogger
shortDescription: >-
  Simple steps to enable PowerBar widget in your article with WordPress,
  javascript or blogger
---
![Emotes Widget](/img/powerbar-widget.png)

<br>

<br>

## HOW TO ENABLE

<br>

### Enable Vuukle PowerBar widget using WordPress plugin:

In your WordPress Admin panel, go into Settings > Vuukle and choose On for Show Share Bar

![Enable PowerBar in WordPress](/img/powerbar-widget-img-2.png)

<Br>

<br>

### For Blogger:

In your Blogger dashboard, go into Layout tab, edit the Vuukle HTML/JavaScript widget and insert the shortcode `[vuukle-powerbar]`. Then click the Save button.

<br>

<br>

### For JavaScript:

In your website’s HTML, insert the following code where you want the PowerBar widget to display

```javascript
<div class="vuukle-powerbar"></div>
<div class="vuukle-powerbar-vertical"></div> - Use this div for vertical mode
```

- - -

<br>

<br>

## HOW TO CUSTOMIZE

<br>

### JS variables:

```html
powerbar: { enabled: false, //Enables PowerBar widget on the page defaultEmote: 2, //Setting shown emote by default verticalPosition: '400px', //
Space from top for veritcal powerbar
```

<br>

<br>

### WordPress Settings

Wordpress Powerbar Settings:

![WP PowerBar](/img/powerbar-widget-img-3.png)

<br>

<br>

### Change PowerBar widget type using WordPress plugin:

In your WordPress Admin panel, go into Settings > Vuukle, click on the Share Bar Type settings and choose Vertical.

<Br>![WP PowerBar](/img/powerbar-widget-img-4.png)

<br>

Put CSS styles for Share Bar Styles (only for vertical type) to place the PowerBar as you like

![WP PowerBar](/img/powerbar-widget-img-5.png)
