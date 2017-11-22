import * as React from 'react';
import {Mapping} from './RootComponentRegistry';
import {WrapperFactory} from './component/WrapperFactory';
import {ComponentConfig} from './component/WrapperFactory';

function mapClassToResourceType(componentClassName: string): string {
  const parts: string[] = componentClassName.match(/([A-Z][a-z0-9]*)/);

  if (parts) {
    let resourceType: string = parts[0].toLocaleLowerCase();

    const rest: string = componentClassName.substring(parts[0].length);

    if (rest.length > 0) {
      resourceType += '-' + mapClassToResourceType(rest);
    }

    return resourceType;
  }
}

export class ComponentRegistry {
  public readonly mappings: Mapping[];

  private readonly mapping: ((componentClassName: string) => string) | string;

  public constructor(
    mapping?: ((componentClassName: string) => string) | string
  ) {
    this.mappings = [];
    this.mapping = mapping;
  }

  public register(
    componentClass: React.ComponentClass<any>,
    name?: string
  ): void {
    const componentClassName: string = name || componentClass.name;
    const resourceType: string = this.mapToResourceType(componentClassName);

    this.mappings.push(new Mapping(resourceType, componentClass, null));
  }

  public registerVanilla<R>(config: ComponentConfig<R>): void {
    /* tslint:disable:no-string-literal */
    const componentClassName: string =
      config.shortName || config.component.name;
    /* tsslint:enable:no-string-literal */
    const resourceType: string =
      config.name || this.mapToResourceType(componentClassName);
    const wrapperClass = WrapperFactory.createWrapper(config, resourceType);

    this.mappings.push(
      new Mapping(resourceType, wrapperClass, config.component)
    );
  }

  private mapToResourceType(componentClassName: string): string {
    if (typeof this.mapping === 'function') {
      return this.mapping(componentClassName);
    }

    if (typeof this.mapping === 'string') {
      return `${this.mapping}/` + mapClassToResourceType(componentClassName);
    }

    return mapClassToResourceType(componentClassName);
  }
}
