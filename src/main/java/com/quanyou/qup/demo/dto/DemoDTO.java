package com.quanyou.qup.demo.dto;

import lombok.Data;
import java.io.Serializable;

/**
 * Demo
 *
 * @author 抓抓匠
 * @since 2020-06-10
 */
@Data
public class DemoDTO implements Serializable{
    private static final long serialVersionUID = -94106037390195379L;

    /**
     * ID
     */
    private String id;

    /**
     * 编码
     */
    private String code;

    /**
     * 名称
     */
    private String name;

    /**
     * 类型ID
     */
    private String typeId;


    /**
     * 数据状态
     */
    private Integer dataStatus;

    /**
     * 排序
     */
    private Integer sort;
}