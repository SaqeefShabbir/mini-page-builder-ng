export interface ComponentStyles {
    [key: string]: string;
  }

export interface BaseComponent {
    id: string;
    type: string;
    styles: {
      'width'?: string;
      'height'?: string;
      'left'?: string;
      'top'?: string;
      [key: string]: any;
    };
    content?: any;
  }
  
  export class TextComponent implements BaseComponent {
    id = `text-${Math.random().toString(36).substr(2, 9)}`;
    type = 'text';
    content = 'Edit this text';
    styles = {
      'font-size': '16px',
      'color': '#000000',
      'text-align': 'left',
      'padding': '10px',
      'margin': '0px 0px 10px 0px' 
    };
  }

  export class ImageComponent implements BaseComponent {
    id = `image-${Math.random().toString(36).substr(2, 9)}`;
    type = 'image';
    content = 'assets/backpack_2459934_1920.png';
    styles = {
      'width': '100%',
      'max-width': '300px',
      'height': 'auto',
      'padding': '10px',
      'margin': '0px 0px 10px 0px',
      'display': 'block'
    };
  }
  
  export class ButtonComponent implements BaseComponent {
    id = `button-${Math.random().toString(36).substr(2, 9)}`;
    type = 'button';
    content = 'Click Me';
    styles = {
      'background-color': '#007bff',
      'color': '#ffffff',
      'padding': '5px',
      'border': 'none',
      'border-radius': '20px',
      'cursor': 'pointer',
      'font-size': '16px',
      'margin': '0px 0px 10px 0px',
      'width': '80px',
      'height': '50px'
    };
    action = {
      type: 'link',
      value: '#'
    };
  }

  export class DividerComponent implements BaseComponent {
    id = `divider-${Math.random().toString(36).substr(2, 9)}`;
    type = 'divider';
    styles = {
      'border-top': '1px solid #ddd',
      'margin': '20px 0px',
      'width': '100%',
      'padding': '10px 0px'
    };
  }
  
  export class VideoComponent implements BaseComponent {
    id = `video-${Math.random().toString(36).substr(2, 9)}`;
    type = 'video';
    content = 'assets/fog_sunshine_mist_small.mp4';
    styles = {
      'width': '100%',
      'height': '100%',
      'margin': '0px',
      'padding': '0px'
    };
    autoplay = false;
    loop = true;
    muted = true;
    showControls = true;
  }
  
  export class SectionComponent implements BaseComponent {
    id = `section-${Math.random().toString(36).substr(2, 9)}`;
    type = 'section';
    components: BaseComponent[] = [];
    styles = {
      'background-color': 'magenta',
      'border-radius': '4px',
      'height': '50px',
      'width': '95%',
    };
  }