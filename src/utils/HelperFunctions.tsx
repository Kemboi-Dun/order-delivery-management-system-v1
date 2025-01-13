import { FilterFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Space } from "antd";
import { get } from "lodash";
import { useRef, useState } from "react";

// handle the color of the status tag or any tag
export const statusColorTag = (status: string) => {
  switch (status) {
    case "Delivered":
      return "success";
      break;
    case "Processing":
      return "processing";
      break;
    case "Dispatched":
      return "warning";
      break;
    case "Cancelled":
      return "error";
      break;

    default:
      return "default";
      break;
  }
};

// Column search functionlaity
type HandleSearchTypes = {
  selectedKeys: any[];
  confirm: () => void;
  dataIndex: string;
};

export const useColumnSearch = () => {
  const [searchedText, setSearchedText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<any>(null);

  // Search handler
  const handleSearch = ({
    selectedKeys,
    confirm,
    dataIndex,
  }: HandleSearchTypes) => {
    confirm();
    setSearchedText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Reset search --- handler
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchedText("");
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Flex gap="small">
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch({ selectedKeys, confirm, dataIndex })
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="default"
            icon={<FilterFilled />}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchedText(selectedKeys[0]);
              setSearchedText(dataIndex);
            }}
          >
            Filter
          </Button>
        </Flex>

        <Flex justify="space-between" gap="middle" align="center">
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => handleSearch({ selectedKeys, confirm, dataIndex })}
            >
              Search
            </Button>

            <Button
              type="dashed"
              onClick={() => clearFilters && handleReset(clearFilters)}
            >
              Reset
            </Button>
          </Space>
          <Button size="small" type="link" onClick={() => close()}>
            Close
          </Button>
        </Flex>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      get(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open: boolean) {
        if (open) {
          if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        }
      },

      render: (text: string) => {
        searchedColumn === dataIndex ? (
          <p style={{ textDecoration: "underline" }}>{text}</p>
        ) : (
          text
        );
      },
    },
  });

  return { getColumnSearchProps };
};
