---
title: How to integrate Vuukle web version into your native Android application
path: /how-to-integrate-vuukle-in-native-mobile-application/
date: 2020-03-03T23:12:03.284Z
category: Install Vuukle
tags:
  - how to
  - install
  - vuukle
  - native
  - android
shortDescription: >-
  We want to create the best experience possible for you. You have no need to
  update SDK anymore, since it's in the web view we will handle the heavy
  lifting for you. You will get the latest updates and new features as soon as
  they are uploaded on our servers
---
We want to create the best experience possible for you. You have no need to update SDK anymore, since it's in the web view we will handle the heavy lifting for you. You will get the latest updates and new features as soon as they are uploaded on our servers.

You will be working with our **iframe URL's**

Comment widget iframe looks like this:

https://cdn.vuukle.com/amp.html?apiKey=c7368a34-dac3-4f39-9b7c-b8ac2a2da575&host=smalltester.000webhostapp.com&id=381&img=https://smalltester.000webhostapp.com/wp-content/uploads/2017/10/wallhaven-303371-825x510.jpg&title=Newpost&url=https://smalltester.000webhostapp.com/2017/12/new-post-22#1

**Required parameters (for comment widget iframe):**

1. apiKey - Your API key (https://docs.vuukle.com/how-to-embed-vuukle-2.0-via-js/)
2. host - your site host (Exclude http:// or www.)
3. id -unique article ID
4. img - article image
5. title - article title
6. url - article URL (include http:// or www.)

Emote widget iframe looks like this:

https://cdn.vuukle.com/widgets/emotes.html?apiKey=c7368a34-dac3-4f39-9b7c-b8ac2a2da575&host=smalltester.000webhostapp.com&articleId=381&img=https://smalltester.000webhostapp.com/wp-content/uploads/2017/10/wallhaven-303371-825x510.jpg&title=New%20post%2022&url=https://smalltester.000webhostapp.com/2017/12/new-post-22#1

**Required parameters (for emote widget iframe):**

1. apiKey - Your API key (https://docs.vuukle.com/how-to-embed-vuukle-2.0-via-js/)
2. host - your site host (Exclude http:// or www.)
3. articleId -unique article ID
4. img - article image
5. title - article title
6. url - article URL (include http:// or www.)

If you have any additional options to include, please contact support@vuukle.com

**Integration Steps**

1. **Create xml resourse:**

```java
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:id="@+id/container"
    android:layout_height="match_parent"
    tools:context="com.vuukle.webview.MainActivity">

    <WebView
        android:id="@+id/activity_main_webview_comments"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:layout_editor_absoluteX="8dp"
        tools:layout_editor_absoluteY="8dp" />

</FrameLayout>
```

**Add permission to AndroidManifest.xml:**

```java
<uses-permission android:name="android.permission.INTERNET" />
```

**Getting events from javascript page.**

You can listen to events from javascript via console logs. WebChromeClient provides a callback onConsoleMessage.

_Example_:

```
//javascript support
    mWebViewComments.getSettings().setJavaScriptEnabled(true);
    mWebViewComments.getSettings().setDomStorageEnabled(true);
    mWebViewComments.getSettings().setSupportMultipleWindows(true);
    mWebViewComments.setWebChromeClient(webChromeClient);
```

The webСlientChrome looks like this

```
 private WebChromeClient webChromeClient = new WebChromeClient() {
```

Return the selected photo or snapshot

```
protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
    if (CAMERA_PERMISSION == resultCode && requestCode == Activity.RESULT_OK)
        openPhoto.selectImage(MainActivity.this);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        if (requestCode == REQUEST_SELECT_FILE) {
            if (uploadMessage == null)
                return;
            if (intent == null) {
                Intent intent1 = new Intent();
                intent1.setData(openPhoto.getImageUri());
             uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, intent1));
            } else
                uploadMessage.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, intent));
            uploadMessage = null;
        }
    } else if (requestCode == FILE_CHOOSER_RESULT_CODE) {
        if (null == mUploadMessage)
           return;
        Uri result = intent == null || resultCode != MainActivity.RESULT_OK ? null : intent.getData();
        mUploadMessage.onReceiveValue(result);
        mUploadMessage = null;
    }
}
```

**Passing data to javascript page.**

WebView lets you ability to inject your javascript code into page. We can use it for passing data.

_Example_:

```java
//signInUser(name, email) - function implemented in javascript code on page
mWebViewComments.loadUrl("javascript:signInUser('" + name + "', '" + email + "')");
```

**Listening on url loading.**

We also can override url loading with WebViewClient.

_Example_:

```
 mWebViewComments.setWebViewClient(new WebViewClient() {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, final String url) {
        //Clicked url
        Log.d(TAG, "Clicked url: " + url);
        if (url.contains("mailto:to") || url.contains("mailto:")) {
            openSite.openEmail(url.replace("%20", " "));
        } else {
            //Lets signInUser whenever url is clicked just for sample
            openSite.openWhatsApp(url, view);
            openSite.openMessenger(url);
        }
        //if u use super() it will load url into webview
        return true;
    }
});
```

Class for different page transitions

_Example_:

```
public class OpenSite {
```

**Open dialog**

Lets you choose between gallery and photo.

_Example_:

```
public class OpenPhoto {
    private String FORMAT_TIME = "yyyyMMddHHmmss";
    private String FILE_EXTENSION = ".jpg";
    private String FILE_PROVIDER = "com.vuukle.webview.android.fileprovider";
    private Uri imageUri;
    public Uri getImageUri() {
        return imageUri;
    }
    private File getPictureFile(Context contex) throws IOException {
        String timeStamp = new SimpleDateFormat(FORMAT_TIME).format(new Date());
        String pictureFile = "VUUKLE" + timeStamp;
        File storageDir = contex.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(pictureFile, FILE_EXTENSION, storageDir);
        String pictureFilePath = image.getAbsolutePath();
        return image;
    }
    public  void selectImage(Context context) {
        final CharSequence[] options = {context.getString(R.string.take_photo), context.getString(R.string.choose_from_gallery), context.getString(R.string.cancel)};
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(context.getString(R.string.choose_your_profile_picture));
        builder.setItems(options, (dialog, item) -> {
            if (options[item].equals(context.getString(R.string.take_photo))) {
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                File photo = null;
                try {
                    photo = getPictureFile(context);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                imageUri = FileProvider.getUriForFile(
                        context,
                        FILE_PROVIDER,
                        photo);
                intent.putExtra(MediaStore.EXTRA_OUTPUT,
                        imageUri);
                ((MainActivity) context).startActivityForResult(intent, REQUEST_SELECT_FILE);
            } else if (options[item].equals(context.getString(R.string.choose_from_gallery))) {
                try {
                    Intent pickPhoto = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                    ((MainActivity) context).startActivityForResult(pickPhoto, REQUEST_SELECT_FILE);
                } catch (ActivityNotFoundException e) {
                }
           } else if (options[item].equals(context.getString(R.string.cancel))) {                dialog.dismiss();
            }
        });
        builder.show();
    }
}
```

- - -

**Handling social login windows.**

You need to add the property `.setSupportMultipleWindows(true)`to webview setting in order to enable the support of multiple windows.

- - -

Implements the possibility to go back on the previous page.

**Handling onBackPressed**

```@Override
 public void onBackPressed() {
     if (popup != null && popup.getParent() != null) {
         mContainer.removeView(popup);
         popup.destroy();
     } else {
         mWebViewComments.goBack();
     }
 }
```

- - -

The full application example you can [check here](https://github.com/vuukle/webSDK) or download a demo APK [Here](https://www.dropbox.com/s/81ljpjzb0zrgong/Vuukle.apk?dl=0)