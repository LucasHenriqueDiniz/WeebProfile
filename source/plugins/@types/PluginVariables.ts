export type DefaultValue = string | boolean | number | string[];
interface PluginVariables {
  required?: boolean;
  type: "string" | "boolean" | "number" | "stringArray" | "stringRadio";
  defaultValue?: DefaultValue;
  description?: string;
  sections?: string[];
  options?: string[];
}

export default PluginVariables;
